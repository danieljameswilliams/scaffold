var Q = require("q");
var util = require("util");
var nconf = require('nconf');

var helpers = require('helpers/helpers.js');


function isAuth( callback ) {
    return function ( request, response ) {
        var token = request.cookies['usertoken'];

        if( token ) {
            var validateAuthToken = _validateAuthToken( token );

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

function _validateAuthToken( token ) {
    var deferred = Q.defer();

    var fields = 'userId, username, email, firstName, lastName';
    var url = util.format('%s://%s/authenticate', nconf.get('api:protocol'), nconf.get('api:host'));
    var parameters = {
        fields: fields,
        permission: 'staff',
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

module.exports = isAuth;