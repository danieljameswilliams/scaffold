var passwordHash = require('password-hash');
var Q = require("q");

var User = require('../../../models/user.js');
var authManual = require('./_auth_manual.js');

function signup( request, response ) {
  response.setHeader( 'Access-Control-Allow-Origin', '*' );

  var username = request.body.username;
  var password = request.body.password;
  var firstName = request.body.first_name;
  var lastName = request.body.last_name;

  var getUser = authManual.getUser( username );

  getUser.then(function( user ) {
    return response.send(409);
  });

  getUser.fail(function( errorObj ) {
    if( errorObj.statusCode == 204 ) {

      var userObj = {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: username,
        password: passwordHash.generate(password),
        isStaff: false
      };

      var getNewUser = createNewUser( userObj );

      getNewUser.then(function( user ) {
        var getHttpResponse = authManual.buildHttpResponse( user, 'customer' );

        getHttpResponse.then(function( context ) {
          return response.json(context);
        });
      });

      getNewUser.fail(function( errorObj ) {
        return response.send(500);
      });
    }
    else if( errorObj.statusCode == 403 ) {
      return response.send(403);
    }
    else if( errorObj.statusCode == 500 ) {
      return response.send(500);
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
      user = user.toObject();
      delete user.password;

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
  signup: signup,
  createNewUser: createNewUser
};