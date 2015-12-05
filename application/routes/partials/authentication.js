module.exports = function( app, controllers, decorators ) {
  // GET Requests
  app.get( '/auth', controllers.authentication.auth_token.validate );

  // POST Requests
  app.post( '/auth/manual', controllers.authentication.auth_manual.login );
  app.post( '/auth/facebook', controllers.authentication.auth_facebook.login );
  app.post( '/auth/staff', controllers.authentication.auth_staff.login );
  app.post( '/signup/manual', controllers.authentication.signup_manual.signup );
  app.post( '/account/facebook', decorators.isAuth(controllers.authentication.add_facebook.add) );

  // PUT Requests
};