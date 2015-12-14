var http = require('http');
var Q = require("q");
var util = require("util");
var nconf = require('nconf');


function isAuth( callback ) {
    return function ( request, response ) {
        var token = request.cookies['usertoken'];

        if( token ) {
            var addToActivityLog = (_checkAndSetSessionCookie( request, response ) == false ? true : false);
            var validateAuthToken = _validateAuthToken( token, addToActivityLog );

            validateAuthToken.then(function( user ) {
                request.isLoggedIn = true;
                request.user = JSON.parse(user);
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
    var url = util.format('%s://%s/authenticate?permission=customer&token=%s&activity=%s&fields=%s',
        nconf.get('api:protocol'),
        nconf.get('api:host'),
        token,
        addToActivityLog,
        '_id,username'
    );

    http.get(url, function( response ) {
        var data = '';

        response.on('data', function ( chunk ) {
            data += chunk;
        });

        response.on('end', function () {
            if( response.statusCode == 200 ) {
                deferred.resolve(data);
            }
            else if ( response.statusCode == 403 ) {
                var errorObj = { 'statusCode': 403, 'message': data.message };
                deferred.reject(errorObj);
            }
            else {
                var errorObj = { 'statusCode': 500, 'message': data.message };
                deferred.reject(errorObj);
            }
        });

        response.on('error', function( error ) {
            var errorObj = { 'statusCode': 500, 'message': error.message };
            deferred.reject(errorObj);
        });
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