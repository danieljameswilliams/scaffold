module.exports = function( app, controllers ) {
  // GET Requests
  app.get( '/bruger/opret', controllers.user.get_signup );

  // POST Requests
  // PUT Requests
};