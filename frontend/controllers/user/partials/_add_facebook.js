var User = require('../../../models/user.js');
var mongoose = require('mongoose');
var https = require('https');

module.exports = function( request, response ) {
  var accessToken = request.body.accessToken;
  var userId = request.body.userId;
  var username = request.body.username;

  https.get('https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token=' + accessToken, function( fbResponse ) {
    fbResponse.on('data', function (chunk) {
      var result = JSON.parse(chunk);
      if( result.error && result.error.code == 190 ) {
        return response.send(403);
      }
      else if( result.id == userId ) {
        return _onUserAuthenticationCompleted(response, username, result);
      }
    });
  }).on('error', function(e) {
    return response.send(500);
  });
}

function _onUserAuthenticationCompleted( response, username, fbMeObj ) {
  var userId = fbMeObj.id;

  User.findOne({ 'username': username }, function( err, user ) {
    if( err ) {
      return response.send(500);
    }

    if( user !== null ) {
      user.facebookId = userId;

      user.save(function( saveErr ) {
        if( saveErr ) {
          return response.send(500);
        }

        return response.send(200);
      });
    }
  });
}