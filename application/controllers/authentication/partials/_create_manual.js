var passwordHash = require('password-hash');
var Q = require("q");

var User = require('models/user.js');
var authManual = require('./_auth_manual.js');
var login = require('../helpers/_login.js').login;
var createNewUser = require('../helpers/_createNewUser.js');


function create( request, response ) {
    var username = request.body.username;
    var password = request.body.password;
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;

    var getUser = authManual.getUser( username );

    getUser.then(function( user ) {
        return response.sendStatus(409);
    });

    getUser.fail(function( errorObj ) {
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

                getHttpResponse.fail(function() {
                    return response.sendStatus(500);
                });
            });

            getNewUser.fail(function( errorObj ) {
                return response.sendStatus(500);
            });
        }
        else if( errorObj.statusCode == 403 ) {
            return response.sendStatus(403);
        }
        else if( errorObj.statusCode == 500 ) {
            return response.sendStatus(500);
        }
    });
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
    create: create
};