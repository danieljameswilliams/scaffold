var User = require('../../../models/user.js');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');

module.exports = function( request, response ) {
  var username = request.body.username;
  var password = request.body.password;

  User.findOne({ 'username': username }, function( err, user ) {
    if( (err || !user) || !passwordHash.verify(password, user.password) ) {
      return response.redirect('/?ref=login_failed');
    }

    // Save a cookie on the clients computer containing the token.
    response.cookie( 'usertoken', 'token-goes-here', {
      maxAge: 900000,
      httpOnly: true,
      secure: true
    });

    var context = {
      'user': user,
      'token': 'token-goes-here'
    };

    //////////////////
    /// PUBLIC API ///
    //////////////////

    return response.redirect('/?ref=login_manual');
  });
}