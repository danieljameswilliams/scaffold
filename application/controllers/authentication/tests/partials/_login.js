var assert = require('assert');
var httpMocks = require('node-mocks-http');

var helpers = require('helpers/helpers.js');
var login = require('controllers/authentication/helpers/_login.js').login;


function test( done ) {
    this.timeout(30000); // 30 seconds

    var request = httpMocks.createRequest();
    var response = httpMocks.createResponse();

    request.body.fields = 'userId, username, firstName, lastName';
    request.body.username = 'test@example.com';
    request.body.password = '12345678';

    var getDatabaseConnection = helpers.connectDatabase();

    getDatabaseConnection.then(function() {
        var getTestUser = helpers.getTestUser();

        getTestUser.then(function( user ) {
            var getLogin = login(request, response, user, 'test');

            getLogin.then(function( context ) {
                try {
                    if( typeof(context.token) !== 'string' ) {
                        var error = assert.fail();
                        return done(error);
                    }

                    assert.deepEqual(context.user, {
                        userId: 1,
                        firstName: 'John',
                        lastName: 'Doe',
                        username: 'test@example.com'
                    });

                    return done();
                }
                catch( error ) {
                    return done(error);
                }
            });

            getLogin.fail(function( errorObj ) {
                var error = assert.fail();
                return done(error);
            });
        });

        getTestUser.fail(function() {
            var error = assert.fail();
            return done(error);
        });
    });

    getDatabaseConnection.fail(function( errorObj ) {
        throw(errorObj);
    });
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = test;