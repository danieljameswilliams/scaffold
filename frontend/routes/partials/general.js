module.exports = function( app, controllers ) {
  // GET Requests
  app.get( '/', controllers.general.get_frontpage );
  app.get( '/version', controllers.general.get_version );

  // POST Requests
  // PUT Requests
};