var http = require('http');
var Q = require("q");
var moment = require('moment');

function page( request, response ) {
    var getUsers = fetchAllUsers();

    getUsers.then(function( users ) {
        response.set( 'Content-Type', 'text/html' );
        response.set( 'Cache-Control', 'no-store, no-cache' );
        response.set( 'Expires', '-1' );

        var period_from = new Date();
        var period_to = moment(period_from).add(-5, 'days').toDate();

        var activeUsersInPeriod = getActiveUsersInPeriod( users, period_from, period_to );

        var context = {
            users: users,
            usersInPeriod: activeUsersInPeriod
        };

        if( request.query.async ) {
            // We send some JSON to be handled in the frontend.
            return response.json( context );
        }
        else {
            // We want to serve some pre-rendered HTML, due to either a server-request or noscript.
            return response.render('users', context);
        }
    });

    getUsers.fail(function() {

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
    });

    return deferred.promise;
}

function getActiveUsersInPeriod( users, period_from, period_to ) {
    return 'Hello';
}

//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = page;