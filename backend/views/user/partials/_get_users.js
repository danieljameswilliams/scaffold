var http = require('http');
var Q = require("q");
var nconf = require('nconf');

var helpers = require('helpers/helpers.js');


function page( request, response ) {
    if( !request.user ) {
        return response.sendStatus(403);
    }

    var getUsers = fetchAllUsers();

    getUsers.then(function( users ) {

        var context = {
            users: users,
            userCount: users.length
        };

        if( request.query.async ) {
            return response.json( context );
        }
        else {
            return response.render('users', context);
        }
    });

    getUsers.fail(function( errorObj ) {
        if ( errorObj.statusCode == 403 ) {
            return response.sendStatus(403);
        }
        else {
            return response.sendStatus(500);
        }
    });
}


////////////////////
///// PARTIALS /////
////////////////////

function fetchAllUsers() {
    var deferred = Q.defer();
    var url = util.format('%s://%s/users', nconf.get('api:protocol'), nconf.get('api:host'));

    var requestResponse = helpers.httpRequest({
        url: url,
        method: 'GET',
        json: true
    });

    requestResponse.then(function( body ) {
        deferred.resolve(body);
    });

    requestResponse.fail(function( errorObj ) {
        deferred.reject(errorObj);
    });

    return deferred.promise;
}

//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = page;