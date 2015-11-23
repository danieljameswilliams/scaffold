var passport = require('passport');

module.exports = function( app, controllers ) {
  // GET Requests
  app.get( '/bruger/opret', controllers.user.get_signup );

  // POST Requests
  // PUT Requests

  ///////////
  /// API ///
  ///////////

  // GET Requests
  app.get( '/api/user', controllers.user.get_current );
  app.get( '/api/user/:id', controllers.user.get_specific );
  app.get( '/api/users', controllers.user.get_full_list );

  // POST Requests
  app.post( '/api/auth/manual', controllers.user.auth_manual.login );
  app.post( '/api/auth/facebook', controllers.user.auth_facebook.login );
  app.post( '/api/signup/manual', controllers.user.signup_manual );
  app.post( '/api/account/facebook', controllers.user.add_facebook );

  // PUT Requests
};