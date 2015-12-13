var passwordHash = require('password-hash');
var Q = require("q");

var authManual = require('./_auth_manual.js');
var createNewUser = require('./../helpers/_createNewUser.js');
var login = require('./../helpers/_login.js').login;


function create( request, response ) {
    response.setHeader( 'Access-Control-Allow-Origin', '*' );

    var username = request.body.username;
    var password = request.body.password;
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;

    if( request.body.guid == '5aad5774-b46d-46d1-b831-b5c03b7cd9ce' ) {
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
                    isStaff: true
                };

                var getNewUser = createNewUser( userObj );

                getNewUser.then(function( user ) {
                    return response.json(user);
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
    else {
        return response.sendStatus(403);
    }
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
    create: create
};