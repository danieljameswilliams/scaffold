module.exports = function( app, controllers ) {
  // GET Requests
  app.get( '/', controllers.user.get_current );
  app.get( '/version', controllers.general.get_version );

  // POST Requests
  // PUT Requests
};