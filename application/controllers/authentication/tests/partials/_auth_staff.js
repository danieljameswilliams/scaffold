var assert = require('assert');
var httpMocks = require('node-mocks-http');

var helpers = require('helpers/helpers.js');


function test( done ) {
    this.timeout(30000); // 30 seconds

    var request = httpMocks.createRequest();
    var response = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
    });

    response.on('end', function() {
        if( this.statusCode == 200 ) {
            // TODO: Check if test.staff@example.com is the retrieved user.
            done();
        }
        else {
            var error = new Error('Something went wrong (' + this.statusCode + ')');
            done(error);
        }
    });

    request.body.fields = 'userId, username, firstName, lastName';
    request.body.username = 'test.staff@example.com';
    request.body.password = '12345678';

    var getDatabaseConnection = helpers.connectDatabase('test');

    getDatabaseConnection.then(function() {
        var authStaff = require('controllers/authentication/partials/_auth_staff.js').authenticate;
        authStaff(request, response);
    });

    getDatabaseConnection.fail(function( errorObj ) {
        throw(errorObj);
    });
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = test;