var passwordHash = require('password-hash');
var crypto = require('crypto');
var Q = require("q");

var User = require('../../../models/user.js');
var AuthToken = require('../../../models/authtoken.js');


function login( request, response ) {
  response.setHeader( 'Access-Control-Allow-Origin', '*' );

  var username = request.body.username;
  var password = request.body.password;

  var getUser = getUserManual( username, password );

  getUser.then(function( user ) {
    var getHttpResponse = buildHttpResponse( user, 'customer' );

    getHttpResponse.then(function( context ) {
      return response.json(context);
    });
  });

  getUser.fail(function( errorObj ) {
    if( errorObj.statusCode == 403 ) {
      return response.send(403);
    }
    else if( errorObj.statusCode == 204 ) {
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

function getUserManual( username, password ) {
  var deferred = Q.defer();

  User.findOne({ 'username': username }, function( error, user ) {
    if( error ) {
      var errorObj = { 'statusCode': 500, 'message': error.message };
      deferred.reject(errorObj);
    }
    else if( user && !passwordHash.verify(password, user.password) ) {
      var errorObj = { 'statusCode': 403, 'message': 'Password is incorrect' };
      deferred.reject(errorObj);
    }
    else if( user ) {
      user = user.toObject();
      delete user.password;

      deferred.resolve( user );
    }
    else {
      var errorObj = { 'statusCode': 204, 'message': 'No username registered' };
      deferred.reject(errorObj);
    }
  });

  return deferred.promise;
}


/**
 * Lets actually login the user we have retrieved.
 */
function buildHttpResponse( user, permission ) {
  var deferred = Q.defer();
  var getUniqueToken = _generateUniqueToken();

  getUniqueToken.then(function( token ) {
    var authTokenData = {
      user: user._id,
      token: token,
      permission: permission
    };

    AuthToken.update({ 'user': user._id }, authTokenData, { upsert: true }, function( error ) {
      if( error ) {
        console.log(error);
      }
    });

    context = {
      user: user,
      token: token
    };

    deferred.resolve(context);
  });

  return deferred.promise;
}


/**
 * Generating a unique token to use as login auth.
 * TODO: Should be checking database for making sure it's unique.
 */
function _generateUniqueToken() {
  var deferred = Q.defer();

  crypto.randomBytes(48, function(ex, buf) {
    var token = buf.toString('hex');
    deferred.resolve(token);
  });

  return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
  login: login,
  getUser: getUserManual,
  buildHttpResponse: buildHttpResponse
};