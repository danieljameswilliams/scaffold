module.exports = function( app, controllers, decorators ) {
  // GET Requests
  app.get( '/auth', controllers.user.auth_token.validate );

  // POST Requests
  app.post( '/auth/manual', controllers.user.auth_manual.login );
  app.post( '/auth/facebook', controllers.user.auth_facebook.login );
  app.post( '/auth/staff', controllers.user.auth_staff.login );
  app.post( '/signup/manual', controllers.user.signup_manual.signup );
  app.post( '/account/facebook', decorators.isAuth(controllers.user.add_facebook.add) );

  // PUT Requests
};