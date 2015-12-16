var Q = require("q");
var util = require("util");
var nconf = require('nconf');

var helpers = require('helpers/helpers.js');


function isAuth( callback ) {
    return function ( request, response ) {
        var token = request.cookies['usertoken'];

        if( token ) {
            var addToActivityLog = (_checkAndSetSessionCookie( request, response ) == false ? true : false);
            var validateAuthToken = _validateAuthToken( token, addToActivityLog );

            validateAuthToken.then(function( user ) {
                request.isLoggedIn = true;
                request.user = user;
                return callback( request, response );
            });

            validateAuthToken.fail(function( errorObj ) {
                request.isLoggedIn = false;
                request.user = null;
                return callback( request, response );
            });
        }
        else {
            request.isLoggedIn = false;
            request.user = null;
            return callback( request, response );
        }
    };
}


////////////////////
///// PARTIALS /////
////////////////////

function _validateAuthToken( token, addToActivityLog ) {
    var deferred = Q.defer();

    var fields = 'userId, username, email, firstName, lastName, facebookId';
    var url = util.format('%s://%s/authenticate', nconf.get('api:protocol'), nconf.get('api:host'));
    var parameters = {
        fields: fields,
        permission: 'customer',
        token: token,
        activity: addToActivityLog
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

function _checkAndSetSessionCookie( request, response ) {
    var hasRegisteredSession = request.cookies['session'];

    if( !Boolean(hasRegisteredSession) ) {
        response.cookie( 'session', 'true', {
            httpOnly: false,
            secure: false
        });

        return false;
    }
    else {
        return true;
    }
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = isAuth;