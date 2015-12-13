var http = require('http');
var Q = require("q");


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
    var url = 'http://localhost:9000/users';

    http.get(url, function( response ) {
        var data = '';

        response.on('data', function (chunk) {
            data += chunk;
        });

        response.on('end', function () {
            if( response.statusCode == 200 ) {
                data = JSON.parse(data);
                deferred.resolve(data);
            }
            else if ( response.statusCode == 403 ) {
                var errorObj = { 'statusCode': 403, 'message': data.statusMessage };
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

module.exports = page;