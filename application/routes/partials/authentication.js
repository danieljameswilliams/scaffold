module.exports = function( app, controllers, decorators ) {

  ///////////////
  ///// GET /////
  ///////////////

  app.get( '/authenticate', decorators.isAuth(controllers.authentication.validate.token) );


  ////////////////
  ///// POST /////
  ////////////////

  app.post( '/authenticate/manual', decorators.isAuth(controllers.authentication.authenticate.manual) );
  app.post( '/authenticate/facebook', decorators.isAuth(controllers.authentication.authenticate.facebook) );
  app.post( '/authenticate/staff', decorators.isAuth(controllers.authentication.authenticate.staff) );

  app.post( '/create/manual', decorators.isAuth(controllers.authentication.create.manual) );
  app.post( '/create/staff', decorators.isAuth(controllers.authentication.create.staff) );
  app.post( '/account/facebook', decorators.isAuth(controllers.authentication.add.facebook) );

  ///////////////
  ///// PUT /////
  ///////////////

};