var User = require('../../../models/user.js');
var AuthToken = require('../../../models/authtoken.js');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var https = require('https');
var crypto = require('crypto');
var Q = require("q");
var authManual = require('./_auth_manual.js');


/**
 * The user has sent us accessToken & userId of his Facebook profile,
 * .. We need to validate on server-side that it is in fact a valid token
 * .. So first we "validate", then we "login" or "create" a new user for him.
 * @return {HttpResponse}
 */
function login( request, response ) {
  var accessToken = request.body.accessToken;
  var userId = request.body.userId;

  if( accessToken && userId ) {
    var getUser = getOrCreateUser( accessToken, userId );

    getUser.then(function( user ) {
      var getHttpResponse = authManual.buildHttpResponse( response, user );

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
  else {
    return response.send(400);
  }
}


////////////////////
///// PARTIALS /////
////////////////////


/**
 * First we check if the Facebook-AccessToken is valid, when that is done,
 * .. We then match the facebook-userId with our database, and return a user.
 */
function getOrCreateUser( accessToken, userId ) {
  var deferred = Q.defer();

  if( accessToken && userId ) {
    var getFacebookUser = _validateFacebookToken(accessToken, userId);

    getFacebookUser.then(function( facebookObj ) {
      var getManualUser = _getOrCreateManualUser( facebookObj );

      getManualUser.then(function( manualObj ) {
        deferred.resolve( manualObj );
        return manualObj;
      });

      getManualUser.fail(function( errorObj ) {
        deferred.reject( errorObj );
        return errorObj;
      });
    });

    getFacebookUser.fail(function( errorObj ) {
      deferred.reject( errorObj );
      return errorObj;
    });
  }
  else {
    deferred.reject({ 'statusCode': 400, 'message': 'Missing "AccessToken" or "UserId"' });
  }

  return deferred.promise;
}


/**
 * Validates a Facebook "AccessToken" server-side to ensure security and authentity of user.
 */
function _validateFacebookToken( accessToken, userId ) {
  var deferred = Q.defer();
  var fields = 'id,first_name,last_name,email';
  var url = 'https://graph.facebook.com/me?fields=' + fields + '&access_token=' + accessToken;

  https.get(url, function( httpsResponse ) {
    httpsResponse.on('data', function ( chunk ) {
      var facebookObj = JSON.parse(chunk);

      if( facebookObj.error && facebookObj.error.code == 190 ) {
        var errorObj = { 'statusCode': 403, 'message': 'Not a valid "AccessToken"' };
        deferred.reject(errorObj);
      }
      else if( facebookObj.id == userId ) {
        deferred.resolve(facebookObj);
      }
    });
  }).on('error', function( error ) {
    var errorObj = { 'statusCode': 500, 'message': error.message };
    deferred.reject(errorObj);
  });

  return deferred.promise;
}


/**
 * Validates if the facebook-userID matches a user in our database.
 */
function _getOrCreateManualUser( facebookObj ) {
  var deferred = Q.defer();

  User.findOne({ 'facebookId': facebookObj.id }, { password: 0 }, function( error, user ) {
    if( error ) {
      var errorObj = { 'statusCode': 500, 'message': error.message };
      deferred.reject(errorObj);
    }
    else if( user ) {
      deferred.resolve( user );
    }
    else {
      if( facebookObj.email ) {
        var getDuplicateUsers = _checkIfUserExistByEmail( facebookObj );

        getDuplicateUsers.then(function( manualObj ) {
          deferred.resolve( manualObj );
        });

        getDuplicateUsers.fail(function( errorObj ) {
          deferred.reject( errorObj );
        });
      }
      else {
        deferred.reject({ 'statusCode': 400, 'message': 'Missing "Email" from Facebook' });
      }
    }
  });

  return deferred.promise;
}


/**
 * Checking if there is a manual user by email,
 * If there is a user, we return that user, if not we raise an error.
 */
function _checkIfUserExistByEmail( facebookObj ) {
  var deferred = Q.defer();

  User.findOne({ 'email': facebookObj.email }, { password: 0 }, function( error, user ) {
    if( error ) {
      var errorObj = { 'statusCode': 500, 'message': error.message };
      deferred.reject(errorObj);
    }
    else if( user ) {
      var errorObj = { 'statusCode': 409, 'message': 'The email is already in use' };
      deferred.reject(errorObj);
    }
    else {
      _createANewFacebookUser( facebookObj, deferred );
    }
  });

  return deferred.promise;
}


/**
 * We have now checked if there is already an account by FacebookID and by Email,
 * And now we can create a new User with already attached "facebookId"
 */
function _createANewFacebookUser( facebookObj, deferred ) {
  var user = new User({
    first_name: facebookObj.first_name,
    last_name: facebookObj.last_name,
    username: facebookObj.email,
    email: facebookObj.email,
    facebookId: facebookObj.id
  });

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
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
  login: login,
  getOrCreateUser: getOrCreateUser
};