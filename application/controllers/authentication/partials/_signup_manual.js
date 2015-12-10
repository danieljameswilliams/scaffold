var passwordHash = require('password-hash');
var Q = require("q");

var User = require('../../../models/user.js');
var authManual = require('./_auth_manual.js');
var login = require('./../helpers/_login.js').login;


function create( request, response ) {
  response.setHeader( 'Access-Control-Allow-Origin', '*' );

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
        var getHttpResponse = login( request, user, 'customer' );

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


////////////////////
///// PARTIALS /////
////////////////////

/**
 * We have now checked if there is already an account by FacebookID and by Email,
 * And now we can create a new User with already attached "facebookId"
 */
function createNewUser( userObj ) {
  var deferred = Q.defer();

  var user = new User(userObj);

  user.save(function( error, user ) {
    if( error ) {
      var errorObj = { 'statusCode': 500, 'message': error.message };
      deferred.reject(errorObj);
    }
    else if( user ) {
      deferred.resolve(user);
    }
    else {
      var errorObj = { 'statusCode': 500, 'message': 'Saved user, but got no user in return.' };
      deferred.reject(errorObj);
    }
  });

  return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
  create: create,
  createNewUser: createNewUser
};