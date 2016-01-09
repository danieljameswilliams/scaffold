var passwordHash = require('password-hash');

var User = require('models/user.js');
var authManual = require('./_auth_manual.js');
var login = require('../helpers/_login.js').login;
var createNewUser = require('../helpers/_createNewUser.js');
var utilities = require('utilities/utilities.js');


function create( request, response, next ) {
    var anonymousId = request.body.anonymousId;
    var username = request.body.username;
    var password = request.body.password;
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;

    var getUser = authManual.getUser( username );

    getUser.then(function( user ) {
        try {
            var error = new Error('User already exist with this username');

            utilities.logger.info(error.message, {
                module: 'Authentication',
                method: 'Create Manual User',
                type: 'User Error',
                anonymousId: anonymousId,
                username: username
            });

            // HTTP Status 409 is "Conflict"
            response.statusCode = 409;
            return response.json(error.message);
        }
        catch( error ) {
            return next(error);
        }
    });

    getUser.fail(function( errorObj ) {
        // HTTP Status 204 is "No Content"
        if( errorObj.statusCode == 204 ) {
            var userObj = {
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: username,
                password: passwordHash.generate(password),
                isStaff: false
            };

            var getNewUser = createNewUser( userObj );

            getNewUser.then(function( user ) {
                var getHttpResponse = login( request, response, user, 'customer' );

                getHttpResponse.then(function( context ) {
                    return response.json(context);
                });

                getHttpResponse.fail(function( errorObj ) {
                    response.statusCode = errorObj.statusCode;
                    return response.json(errorObj.message);
                });
            });

            getNewUser.fail(function( errorObj ) {
                response.statusCode = 409;
                return response.json(errorObj.message);
            });
        }
        else if( errorObj.statusCode == 403 ) {
            response.statusCode = 403;
            return response.json(errorObj.message);
        }
        else if( errorObj.statusCode == 500 ) {
            response.statusCode = 500;
            return response.json(errorObj.message);
        }
    });
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
    create: create
};