var assert = require('assert');
var passwordHash = require('password-hash');
var crypto = require('crypto');
var Q = require("q");
var nconf = require('nconf');
var httpMocks = require('node-mocks-http');

var helpers = require('helpers/helpers.js');


function test( done ) {
    this.timeout(30000); // 30 seconds

    try {
        var getDatabaseConnection = helpers.connectDatabase('test');

        getDatabaseConnection.then(function() {
            var getUniqueUsername = _generateUniqueUsername();

            getUniqueUsername.then(function( context ) {
                try {
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
                        // TODO: Get a auto renewed token with graph.facebook.com/oauth/access_token
                        // https://developers.facebook.com/docs/graph-api/reference/v2.5/app/accounts/test-users

                        var getAccessToken = helpers.getFacebookTestUserAccessToken();

                        getAccessToken.then(function( accessToken ) {
                            var userId = nconf.get('facebook:user:id');

                            var request = httpMocks.createRequest();
                            var response = httpMocks.createResponse({
                                eventEmitter: require('events').EventEmitter
                            });

                            response.on('end', function() {
                                if( this.statusCode == 200 ) {
                                    done();
                                }
                                else {
                                    var error = new Error('Something went wrong (' + this.statusCode + ')');
                                    done(error);
                                }
                            });

                            request.body.authToken = '';
                            request.body.accessToken = accessToken;
                            request.body.userId = userId;
                            request.body.username = user.username;

                            var addFacebook = require('../../partials/_add_facebook.js').add;
                            addFacebook( request, response );
                        });

                        getAccessToken.fail(function( errorObj ) {
                            var error = new Error('Token fetch failed');
                            return done(error);
                        });
                    });

                    getNewUser.fail(function( errorObj ) {
                        var error = new Error('New user failed');
                        return done(error);
                    });
                }
                catch( error ) {
                    return done(error);
                }
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
            var username = 'test.addFacebook.' + token + '@example.com';
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