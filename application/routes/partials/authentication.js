module.exports = function( app, controllers, decorators ) {

  ///////////////
  ///// GET /////
  ///////////////

  app.get( '/authenticate', controllers.authentication.validate.token );


  ////////////////
  ///// POST /////
  ////////////////

  app.post( '/authenticate/manual', controllers.authentication.authenticate.manual );
  app.post( '/authenticate/facebook', controllers.authentication.authenticate.facebook );
  app.post( '/authenticate/staff', controllers.authentication.authenticate.staff );

  app.post( '/create/manual', controllers.authentication.create.manual );
  app.post( '/account/facebook', decorators.isAuth(controllers.authentication.add.facebook) );

  ///////////////
  ///// PUT /////
  ///////////////

};