module.exports = function( app, controllers, views, decorators ) {
    // GET Requests
    app.get( '/bruger/opret', views.user.create );

    // POST Requests
    app.post( '/create/manual', controllers.authentication.create.manual );

    // PUT Requests
};