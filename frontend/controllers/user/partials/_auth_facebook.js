var User = require('../../../models/user.js');
var AuthToken = require('../../../models/authtoken.js');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var https = require('https');
var crypto = require('crypto');

module.exports = function( request, response ) {
  var accessToken = request.body.accessToken;
  var userId = request.body.userId;

  https.get('https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token=' + accessToken, function( fbResponse ) {
    fbResponse.on('data', function (chunk) {
      var result = JSON.parse(chunk);
      if( result.error && result.error.code == 190 ) {
        return response.send(403);
      }
      else if( result.id == userId ) {
        return _onUserAuthenticationCompleted(response, result);
      }
    });
  }).on('error', function(e) {
    return response.send(500);
  });
}

function _onUserAuthenticationCompleted( response, fbMeObj ) {
  var userId = fbMeObj.id;

  User.findOne({ 'facebookId': userId }, { password: 0 }, function( err, user ) {
    crypto.randomBytes(48, function(ex, buf) {
      var token = buf.toString('hex');
      var context = {};

      if( user !== null ) {
        // Save a cookie on the clients computer containing the token.
        response.cookie( 'usertoken', token, {
          maxAge: 900000,
          httpOnly: false,
          secure: false
        });

        var authTokenData = {
          user: user.id,
          token: token
        }
        AuthToken.update({ 'user': user.id }, authTokenData, { upsert: true }, function( tokenErr ) {
          if( tokenErr )
            console.log(tokenErr);
        });

        context = {
          'new': false,
          'user': user,
          'token': token
        };

        return response.json(context);
      }
      else {
        // This means that we don't already have this user with a connected Facebook profile,
        // However we will try to see if he might have a manual user, to avoid duplicating users.
        checkIfUserEmailExist(response, fbMeObj, token);
      }
    });
  });
}

////////////////////
///// PARTIALS /////
////////////////////

function checkIfUserEmailExist( response, fbMeObj, token ) {
  User.findOne({ 'email': fbMeObj.email }, { password: 0 }, function( emailUserErr, emailUser ) {
    if( emailUserErr ) {
      console.log( emailUser );
    }

    if( emailUser !== null ) {
      // This means that we already have a user with this email attached in the system,
      // Lets ask the user to merge the two accounts instead of duplicating him.
      context = {
        user: null,
        token: null,
        error: {
          slug: 'UserAlreadyExistAsManual',
          description: 'The user already exists as manual, please contact customer service to get them merged.'
        }
      };
      return response.send(409);
    }
    else {
      // This means that there is no user with Facebook nor Manual connection,
      // we should in this case create a new user.
      createANewFacebookUser(response, fbMeObj, token);
    }
  });
}

function createANewFacebookUser( response, fbMeObj, token ) {
  var user = new User({
    first_name: fbMeObj.first_name,
    last_name: fbMeObj.last_name,
    username: fbMeObj.email,
    email: fbMeObj.email,
    facebookId: fbMeObj.id
  });

  user.save(function( err, user ) {
    if( err ) {
      console.log(err);
      return response.send(500);
    }

    if( user !== null ) {
      response.cookie( 'usertoken', token, {
        maxAge: 900000,
        httpOnly: false,
        secure: false
      });

      var authTokenData = {
        user: user.id,
        token: token
      }
      AuthToken.update({ 'user': user.id }, authTokenData, { upsert: true }, function( tokenErr ) {
        if( tokenErr )
          console.log(tokenErr);
      });

      user = user.toObject();
      delete user.__v;
      delete user._id;

      context = {
        'new': true,
        'user': user,
        'token': token
      };
      return response.json(context);
    }
  });
}