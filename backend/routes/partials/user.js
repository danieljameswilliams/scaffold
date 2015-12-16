module.exports = function( app, controllers, views, decorators ) {
    // GET Requests
    app.get( '/users', decorators.isAuth(views.user.get_users) );

    // POST Requests
    app.post( '/authenticate/staff', controllers.authentication.authenticate.staff );

    // PUT Requests
};