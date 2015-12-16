var Q = require("q");

var User = require('models/user.js');
var authFacebook = require('./_auth_facebook.js');


/**
 * When the user is logged in, he can call this API method to link his manual account with facebook.
 * @return {HttpResponse}
 */
function add( request, response ) {
    response.setHeader( 'Access-Control-Allow-Origin', '*' );

    var accessToken = request.body.accessToken;
    var userId = request.body.userId;
    var username = request.body.username;

    if( accessToken && userId && username ) {
        var getFacebookData = authFacebook.validateFacebookToken(accessToken, userId);

        getFacebookData.then(function( facebookObj ) {
            var saveToUser = _addFacebookIdToManualUser( response, username, facebookObj );

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
            else if( errorObj.statusCode == 500 ) {
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

function _addFacebookIdToManualUser( response, username, fbMeObj ) {
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


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
    add: add
};