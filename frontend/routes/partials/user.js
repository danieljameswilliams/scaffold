var passport = require('passport');

module.exports = function( app, controllers ) {
  // GET Requests
  app.get( '/bruger/opret', controllers.user.get_current );

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
  app.post( '/api/auth/manual', controllers.user.auth_manual );
  app.post( '/api/auth/facebook', controllers.user.auth_facebook );

  // PUT Requests
};