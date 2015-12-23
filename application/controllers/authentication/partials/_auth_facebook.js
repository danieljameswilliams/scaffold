var Q = require("q");

var User = require('models/user.js');
var helpers = require('helpers/helpers.js');
var login = require('../helpers/_login.js').login;
var createNewUser = require('../helpers/_createNewUser.js');


/**
 * The user has sent us accessToken & userId of his Facebook profile,
 * .. We need to validate on server-side that it is in fact a valid token
 * .. So first we "validate", then we "login" or "create" a new user for him.
 * @return {HttpResponse}
 */
function authenticate( request, response ) {
    response.setHeader( 'Access-Control-Allow-Origin', '*' );
    response.setHeader( 'Access-Control-Allow-Credentials', true );

    var accessToken = request.body.accessToken;
    var userId = request.body.userId;

    if( accessToken && userId ) {
        var getUser = getOrCreateUser( accessToken, userId );

        getUser.then(function( user ) {
            var getHttpResponse = login( request, response, user, 'customer' );

            getHttpResponse.then(function( context ) {
                return response.json(context);
            });
        });

        getUser.fail(function( errorObj ) {
            if( errorObj.statusCode == 403 ) {
                return response.sendStatus(403);
            }
            else if( errorObj.statusCode == 400 ) {
                return response.sendStatus(400);
            }
            else {
                return response.sendStatus(500);
            }
        });
    }
    else {
        return response.sendStatus(400);
    }
}


////////////////////
///// PARTIALS /////
////////////////////


/**
 * First we check if the Facebook-AccessToken is valid, when that is done,
 * .. We then match the facebook-userId with our database, and return a user.
 */
function getOrCreateUser( accessToken, userId ) {
    var deferred = Q.defer();

    if( accessToken && userId ) {
        var getFacebookData = validateFacebookToken(accessToken, userId);

        getFacebookData.then(function( facebookObj ) {
            var getManualUser = _getOrCreateManualUser( facebookObj );

            getManualUser.then(function( manualObj ) {
                deferred.resolve( manualObj );
                return manualObj;
            });

            getManualUser.fail(function( errorObj ) {
                deferred.reject( errorObj );
                return errorObj;
            });
        });

        getFacebookData.fail(function( errorObj ) {
            deferred.reject( errorObj );
            return errorObj;
        });
    }
    else {
        deferred.reject({ 'statusCode': 400, 'message': 'Missing "AccessToken" or "UserId"' });
    }

    return deferred.promise;
}


/**
 * Validates a Facebook "AccessToken" server-side to ensure security and authentity of user.
 */
function validateFacebookToken( accessToken, userId ) {
    var deferred = Q.defer();
    var fields = 'id,first_name,last_name,email';
    var url = 'https://graph.facebook.com/me?fields=' + fields + '&access_token=' + accessToken;

    var requestResponse = helpers.httpRequest({
        url: url,
        method: 'GET',
        json: false
    });

    requestResponse.then(function( facebookObj ) {
        facebookObj = JSON.parse(facebookObj);
        if( facebookObj.error && facebookObj.error.code == 190 ) {
            var errorObj = { 'statusCode': 403, 'message': 'Not a valid "AccessToken"' };
            deferred.reject(errorObj);
        }
        else if( facebookObj.id == userId ) {
            deferred.resolve(facebookObj);
        }
        else {
            var errorObj = { 'statusCode': 500, 'message': facebookObj.error.message };
            deferred.reject(errorObj);
        }
    });

    requestResponse.fail(function( errorObj ) {
        deferred.reject(errorObj);
    });

    return deferred.promise;
}


/**
 * Validates if the facebook-userID matches a user in our database.
 */
function _getOrCreateManualUser( facebookObj ) {
    var deferred = Q.defer();

    User.findOne({ 'facebookId': facebookObj.id }, { password: 0 }, function( error, user ) {
        if( error ) {
            var errorObj = { 'statusCode': 500, 'message': error.message };
            deferred.reject(errorObj);
        }
        else if( user ) {
            deferred.resolve( user );
        }
        else {
            if( facebookObj.email ) {
                var getDuplicateUsers = _checkIfUserExistByEmail( facebookObj );

                getDuplicateUsers.then(function( manualObj ) {
                    deferred.resolve( manualObj );
                });

                getDuplicateUsers.fail(function( errorObj ) {
                    deferred.reject( errorObj );
                });
            }
            else {
                deferred.reject({ 'statusCode': 400, 'message': 'Missing "Email" from Facebook' });
            }
        }
    });

    return deferred.promise;
}


/**
 * Checking if there is a manual user by email,
 * If there is a user, we return that user, if not we raise an error.
 */
function _checkIfUserExistByEmail( facebookObj ) {
    var deferred = Q.defer();

    User.findOne({ 'email': facebookObj.email }, { password: 0 }, function( error, user ) {
        if( error ) {
            var errorObj = { 'statusCode': 500, 'message': error.message };
            deferred.reject(errorObj);
        }
        else if( user ) {
            var errorObj = { 'statusCode': 409, 'message': 'The email is already in use' };
            deferred.reject(errorObj);
        }
        else {
            var userObj = {
                firstName: facebookObj.first_name,
                lastName: facebookObj.last_name,
                username: facebookObj.email,
                email: facebookObj.email,
                facebookId: facebookObj.id,
                isStaff: false
            };
            var getNewUser = createNewUser( userObj );

            getNewUser.then(function( user ) {
                deferred.resolve(user);
            });

            getNewUser.fail(function( errorObj ) {
                deferred.reject(errorObj);
            });
        }
    });

    return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
    authenticate: authenticate,
    getOrCreateUser: getOrCreateUser,
    validateFacebookToken: validateFacebookToken
};