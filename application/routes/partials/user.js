module.exports = function( app, controllers ) {
  // GET Requests
  // POST Requests
  app.post( '/api/auth/manual', controllers.user.auth_manual.login );
  app.post( '/api/auth/facebook', controllers.user.auth_facebook.login );
  app.post( '/api/auth/staff', controllers.user.auth_staff.login );
  app.post( '/api/signup/manual', controllers.user.signup_manual.signup );
  app.post( '/api/account/facebook', controllers.user.add_facebook.add );

  // PUT Requests
};