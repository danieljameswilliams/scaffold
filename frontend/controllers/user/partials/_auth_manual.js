var User = require('../../../models/user.js');
var AuthToken = require('../../../models/authtoken.js');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var crypto = require('crypto');
var Q = require("q");


function login( request, response ) {
  var username = request.body.username;
  var password = request.body.password;

  User.findOne({ 'username': username }, function( err, user ) {
    if( (err || !user) || !passwordHash.verify(password, user.password) ) {
      return response.send(403);
    }
    else if( user ) {
      var getHttpResponse = buildHttpResponse( response, user );

      getHttpResponse.then(function( context ) {
        return response.json(context);
      });
    }
  });
}


////////////////////
///// PARTIALS /////
////////////////////


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
  buildHttpResponse: buildHttpResponse
};