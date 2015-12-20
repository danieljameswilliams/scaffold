var assert = require('assert');
var Q = require("q");

var helpers = require('helpers/helpers.js');


function test( done ) {
    this.timeout(30000); // 30 seconds

    var getDatabaseConnection = helpers.connectDatabase();

    getDatabaseConnection.then(function() {
        var getTestUser = _getTestUser();

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


////////////////////
///// PARTIALS /////
////////////////////

function _getTestUser() {
    var deferred = Q.defer();

    var models = require('../../../models/models.js');

    models.User.findOne({ username: 'test@example.com' }, function( error, user ) {
        if( error ) {
            deferred.reject( error );
        }
        else if( user ) {
            deferred.resolve(user);
        }
        else {
            var errorObj = { statusCode: 500, message: 'No user, and no errors' };
            deferred.reject(errorObj);
        }
    });

    return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = test;