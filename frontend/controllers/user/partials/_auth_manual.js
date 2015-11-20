var User = require('../../../models/user.js');
var AuthToken = require('../../../models/authtoken.js');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var crypto = require('crypto');

module.exports = function( request, response ) {
  var username = request.body.username;
  var password = request.body.password;

  User.findOne({ 'username': username }, function( err, user ) {
    if( (err || !user) || !passwordHash.verify(password, user.password) ) {
      return response.redirect('/?ref=login_failed');
    }

    crypto.randomBytes(48, function(ex, buf) {
      var token = buf.toString('hex');

      // Save a cookie on the clients computer containing the token.
      response.cookie( 'usertoken', token, {
        maxAge: 900000,
        httpOnly: false,
        secure: false
      });

      user = user.toObject();
      delete user['password'];

      var context = {
        'user': user,
        'token': token
      };

      var authTokenData = {
        user: user._id,
        token: token
      }
      AuthToken.update({ 'user': user._id }, authTokenData, { upsert: true }, function( err ) {
        if( err )
          console.log(err);
      });

      //////////////////
      /// PUBLIC API ///
      //////////////////

      return response.json(context);
    });
  });
}