var passwordHash = require('password-hash');
var crypto = require('crypto');
var Q = require("q");

var User = require('../../../models/user.js');
var AuthToken = require('../../../models/authtoken.js');


function login( request, response ) {
  var username = request.body.username;
  var password = request.body.password;

  var getUser = getUser( username );

  getUser.then(function( user ) {
    var getHttpResponse = buildHttpResponse( response, user );

    getHttpResponse.then(function( context ) {
      return response.json(context);
    });
  });

  getUser.fail(function( errorObj ) {
    if( errorObj.statusCode == 403 ) {
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

function getUser() {
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
      deferred.resolve( user );
    }
    else {
      var errorObj = { 'statusCode': 204, 'message': 'No username registered' };
      deferred.reject(errorObj);
    }
  });
}


/**
 * Lets actually login the user we have retrieved.
 */
function buildHttpResponse( response, user ) {
  var deferred = Q.defer();
  var getUniqueToken = _generateUniqueToken();

  getUniqueToken.then(function( token ) {
    response.cookie( 'usertoken', token, {
      maxAge: 900000,
      httpOnly: false,
      secure: false
    });

    var authTokenData = {
      user: user.id,
      token: token
    };

    AuthToken.update({ 'user': user.id }, authTokenData, { upsert: true }, function( error ) {
      if( error ) {
        console.log(error);
      }
    });

    user = user.toObject();
    delete user.__v;
    delete user._id;

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
  getUser: getUser,
  buildHttpResponse: buildHttpResponse
};