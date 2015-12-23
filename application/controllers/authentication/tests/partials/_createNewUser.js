var assert = require('assert');
var passwordHash = require('password-hash');
var crypto = require('crypto');
var Q = require("q");

var helpers = require('helpers/helpers.js');


function test( done ) {
    this.timeout(30000); // 30 seconds

    try {
        var getDatabaseConnection = helpers.connectDatabase('test');

        getDatabaseConnection.then(function() {
            var getUniqueUsername = _generateUniqueUsername();

            getUniqueUsername.then(function( context ) {
                var userObj = {
                    firstName: 'John',
                    lastName: 'Doe',
                    username: context.username,
                    email: context.username,
                    password: passwordHash.generate('12345678'),
                    isStaff: false
                };

                var createNewUser = require('controllers/authentication/helpers/_createNewUser.js');
                var getNewUser = createNewUser(userObj);

                getNewUser.then(function( user ) {
                    try {
                        var fields = 'username, firstName, lastName';
                        var result = helpers.cleanModel(user, fields);

                        assert.deepEqual(result, {
                            firstName: 'John',
                            lastName: 'Doe',
                            username: 'test' + context.token + '@example.com'
                        });

                        return done();
                    }
                    catch( error ) {
                        return done(error);
                    }
                });

                getNewUser.fail(function( errorObj ) {
                    var error = new Error('New user failed');
                    return done(error);
                });
            });

            getUniqueUsername.fail(function( errorObj) {
                var error = new Error('Random generation of username failed');
                return done(error);
            });
        });

        getDatabaseConnection.fail(function( errorObj ) {
            var error = new Error('No Database Connection');
            return done(error);
        });
    }
    catch( error ) {
        return done(error);
    }
}


////////////////////
///// PARTIALS /////
////////////////////

function _generateUniqueUsername() {
    var deferred = Q.defer();

    try {
        crypto.randomBytes(10, function(ex, buf) {
            var token = buf.toString('hex');
            var username = 'test' + token + '@example.com';
            deferred.resolve({ username: username, token: token });
        }, function() {
            var errorObj = { 'statusCode': 500, 'message': 'Crypto failed' };
            deferred.reject(errorObj);
        });
    }
    catch( error ) {
        var errorObj = { statusCode: 500, message: error.message };
        deferred.reject(errorObj);
    }

    return deferred.promise;
}

//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = test;