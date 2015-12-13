var http = require('http');
var Q = require("q");


function isAuth( callback ) {
    return function ( request, response ) {
        var token = request.cookies['usertoken'];

        if( token ) {
            var validateAuthToken = _validateAuthToken( token );

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

function _validateAuthToken( token ) {
    var deferred = Q.defer();
    var url = 'http://localhost:9000/authenticate?permission=staff&token=' + token;


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


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = isAuth;