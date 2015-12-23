var assert = require('assert');

var helpers = require('helpers/helpers.js');


function test( done ) {
    this.timeout(30000); // 30 seconds

    var getDatabaseConnection = helpers.connectDatabase('test');

    getDatabaseConnection.then(function() {
        var getTestUser = helpers.getTestUser();

        getTestUser.then(function( user ) {
            try {
                var fields = 'userId, username, firstName, lastName';
                var result = helpers.cleanModel(user, fields);

                assert.deepEqual(result, {
                    userId: 1,
                    username: 'test@example.com',
                    firstName: 'John',
                    lastName: 'Doe'
                });

                return done();
            }
            catch( error ) {
                return done(error);
            }
        });

        getTestUser.fail(function( errorObj ) {
            var error = assert.fail();
            return done(error);
        });
    });

    getDatabaseConnection.fail(function( errorObj ) {
        var error = assert.fail();
        return done(error);
    });
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = test;