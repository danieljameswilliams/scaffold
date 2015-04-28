module.exports = function( app, controllers ) {
  app.get( '/user', controllers.user.get_current );
  app.get( '/user/:id', controllers.user.get_specific );
  app.get( '/users', controllers.user.get_full_list );
};