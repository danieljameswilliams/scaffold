module.exports = function( app, controllers, views, decorators ) {
  // GET Requests
  app.get( '/', decorators.isAuth(views.general.get_frontpage) );
  app.get( '/app_cache.manifest', views.general.get_app_cache );
  app.get( '/robots.txt', views.general.get_robots );

  app.get( '/version', controllers.general.get_version );

  // POST Requests
  // PUT Requests
};