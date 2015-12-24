var assert = require('assert');
var httpMocks = require('node-mocks-http');
var nconf = require('nconf');

var helpers = require('helpers/helpers.js');


function test( done ) {
    this.timeout(30000); // 30 seconds

    var getDatabaseConnection = helpers.connectDatabase('test');

    getDatabaseConnection.then(function() {
        var getAccessToken = helpers.getFacebookTestUserAccessToken();

        getAccessToken.then(function( accessToken ) {
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

            request.body.fields = 'userId, username, firstName, lastName';
            request.body.accessToken = accessToken;
            request.body.userId = nconf.get('facebook:user:id');

            var authFacebook = require('controllers/authentication/partials/_auth_facebook.js').authenticate;
            authFacebook(request, response);
        });

        getAccessToken.fail(function( errorObj ) {
            var error = new Error('Token fetch failed');
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