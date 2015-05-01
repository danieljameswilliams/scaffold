module.exports = function( app, controllers ) {
  // GET Requests
  app.get( '/', controllers.general.get_frontpage );
  app.get( '/version', controllers.general.get_version );
  app.get( '/app_cache.manifest', controllers.general.get_app_cache );
  app.get( '/robots.txt', controllers.general.get_robots );

  // POST Requests
  // PUT Requests
};