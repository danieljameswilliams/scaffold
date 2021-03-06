var Q = require("q");

var User = require('models/user.js');
var authFacebook = require('./_auth_facebook.js');


/**
 * When the user is logged in, he can call this API method to link his manual account with facebook.
 * @return {HttpResponse}
 */
function add( request, response ) {
    var accessToken = request.body.accessToken;
    var userId = request.body.userId;
    var username = request.body.username;
    var userToken = request.body.userToken;

    var validateAuthToken = _validateAuthToken(userToken);

    validateAuthToken.then(function() {
        if( accessToken && userId && username ) {
            var getFacebookData = authFacebook.validateFacebookToken(accessToken, userId);

            getFacebookData.then(function( facebookObj ) {
                var saveToUser = _addFacebookIdToManualUser( username, facebookObj );

                saveToUser.then(function( manualObj ) {
                    return response.sendStatus(200);
                });

                saveToUser.fail(function( errorObj ) {
                    if( errorObj.statusCode == 403 ) {
                        return response.sendStatus(403);
                    }
                    else if( errorObj.statusCode == 500 ) {
                        return response.sendStatus(500);
                    }
                });
            });

            getFacebookData.fail(function( errorObj ) {
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
    });

    validateAuthToken.fail(function() {
        return response.sendStatus(403);
    });
}


////////////////////
///// PARTIALS /////
////////////////////

function _addFacebookIdToManualUser( username, fbMeObj ) {
    var deferred = Q.defer();
    var userId = fbMeObj.id;

    User.findOne({ 'username': username }, function( err, user ) {
        if( err ) {
            var errorObj = { 'statusCode': 500, 'message': err.message };
            deferred.reject(errorObj);
        }
        else if( user ) {
            // TODO: Add a check if there is any other users using this ID already.
            user.facebookId = userId;

            user.save(function( saveErr ) {
                if( saveErr ) {
                    var errorObj = { 'statusCode': 500, 'message': saveErr.message };
                    deferred.reject(errorObj);
                }

                deferred.resolve(user);
            });
        }
    });

    return deferred.promise;
}


function _validateAuthToken( token ) {
    var deferred = Q.defer();

    var fields = 'userId, username, email, firstName, lastName';
    var url = util.format('%s://%s/authenticate', nconf.get('api:protocol'), nconf.get('api:host'));
    var parameters = {
        fields: fields,
        token: token
    };

    var requestResponse = helpers.httpRequest({
        url: helpers.addUrlParameters(url, parameters),
        method: 'GET',
        json: true
    });

    requestResponse.then(function( user ) {
        deferred.resolve(user);
    });

    requestResponse.fail(function( errorObj ) {
        deferred.reject(errorObj);
    });

    return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
    add: add
};