module.exports = function( app, controllers, views, decorators ) {
    // GET Requests
    app.get( '/bruger/opret', views.user.create );

    // POST Requests
    app.post( '/authenticate/facebook', controllers.authentication.authenticate.facebook );
    app.post( '/authenticate/manual', controllers.authentication.authenticate.manual );
    app.post( '/create/manual', controllers.authentication.create.manual );
    app.post( '/account/facebook', controllers.authentication.add.facebook );

    // PUT Requests
};