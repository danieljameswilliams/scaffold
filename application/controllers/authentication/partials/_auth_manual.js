var passwordHash = require('password-hash');
var Q = require("q");

var User = require('models/user.js');
var login = require('../helpers/_login.js').login;


function authenticate( request, response ) {
    var username = request.body.username;
    var password = request.body.password;


    if( username && password ) {
        var getUser = getUserManual( username, password );

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
            else if( errorObj.statusCode == 204 ) {
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

function getUserManual( username, password ) {
    var deferred = Q.defer();

    User.findOne({ 'username': username }, function( error, user ) {
        if( error ) {
            var errorObj = { 'statusCode': 500, 'message': error.message };
            deferred.reject(errorObj);
        }
        else if( user && password && !passwordHash.verify(password, user.password) ) {
            var errorObj = { 'statusCode': 403, 'message': 'Password is incorrect' };
            deferred.reject(errorObj);
        }
        else if( user ) {
            deferred.resolve( user );
        }
        else {
            var errorObj = { 'statusCode': 204, 'message': 'No username registered' };
            deferred.reject(errorObj);
        }
    });

    return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
    authenticate: authenticate,
    getUser: getUserManual
};