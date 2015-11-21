var User = require('../../../models/user.js');
var AuthToken = require('../../../models/authtoken.js');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var crypto = require('crypto');

module.exports = function( request, response ) {
  var username = request.body.username;
  var password = request.body.password;
  var firstName = request.body.first_name;
  var lastName = request.body.last_name;

  User.findOne({ 'username': username }, function( err, user ) {
    if( err ) {
      return response.send(500);
    }

    if( user == null ) {
      // This means that there is no other manual user by this email, which also means there are no Facebook users.
      var newUser = new User({
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: username,
        password: passwordHash.generate(password)
      });
      newUser.save(function( newErr, newUser ) {
        if( newErr ) {
          return response.send(500);
        }

        if( newUser !== null ) {
          crypto.randomBytes(48, function(ex, buf) {
            var token = buf.toString('hex');

            // Save a cookie on the clients computer containing the token.
            response.cookie( 'usertoken', token, {
              maxAge: 900000,
              httpOnly: false,
              secure: false
            });

            newUser = newUser.toObject();
            delete newUser['password'];

            var context = {
              'new': true,
              'user': newUser,
              'token': token
            };

            var authTokenData = {
              user: newUser._id,
              token: token
            }
            AuthToken.update({ 'user': newUser._id }, authTokenData, { upsert: true }, function( err ) {
              if( err )
                console.log(err);
            });

            return response.json(context);
          });
        }
      });
    }
    else {
      return response.send(409);
    }
  });
}

////////////////////
///// PARTIALS /////
////////////////////