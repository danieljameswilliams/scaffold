var User = require('../../../models/user.js');
var AuthToken = require('../../../models/authtoken.js');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var https = require('https');
var crypto = require('crypto');

module.exports = function( request, response ) {
  var accessToken = request.body.accessToken;
  var userId = request.body.userId;

  https.get('https://graph.facebook.com/me?access_token=' + accessToken, function( fbResponse ) {
    fbResponse.on('data', function (chunk) {
      var result = JSON.parse(chunk);
      if( result.id == userId ) {
        _onUserAuthenticationCompleted(response, result);
      }
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

function _onUserAuthenticationCompleted( response, fbMeObj ) {
  var userId = fbMeObj.id;

  User.findOne({ 'facebookId': userId }, { password: 0 }, function( err, user ) {
    crypto.randomBytes(48, function(ex, buf) {
      var token = buf.toString('hex');

      // Save a cookie on the clients computer containing the token.
      response.cookie( 'usertoken', token, {
        maxAge: 900000,
        httpOnly: false,
        secure: false
      });

      var context = {
        'user': user,
        'token': token
      };

      AuthToken.insert({ 'username': user.username, 'token': token }, function( err, token ) {
      });

      //////////////////
      /// PUBLIC API ///
      //////////////////

      return response.json(context);
    });
  });
}