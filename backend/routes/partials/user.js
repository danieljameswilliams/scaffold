module.exports = function( app, controllers, decorators ) {
  // GET Requests
  app.get( '/users', decorators.isAuth(controllers.user.get_users) );

  // POST Requests
  // PUT Requests
};