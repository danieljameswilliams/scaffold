var AuthToken = require('../../models/authtoken.js');
var User = require('../../models/user.js');

module.exports = function requiresAccess( callback ) {
  return function ( request, response ) {
    var token = request.cookies.usertoken;

    AuthToken.findOne({ 'token': token }).populate('user').exec(function( err, tokenResponse ) {
        if( err ) {
          request.isLoggedIn = false;
          request.user = null;
          return callback( request, response );
        }

        if( tokenResponse !== null ) {
          var user = tokenResponse.user.toObject();
          delete user.password;

          request.isLoggedIn = true;
          request.user = user;
        }
        else {
          request.isLoggedIn = false;
          request.user = null;
        }

        return callback( request, response );
    });
  };
}