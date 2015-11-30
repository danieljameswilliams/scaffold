module.exports = function( app, controllers ) {
  // GET Requests
  app.get( '/users', controllers.user.get_users );

  // POST Requests
  // PUT Requests
};