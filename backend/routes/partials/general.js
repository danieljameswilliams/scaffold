module.exports = function( app, controllers, views, decorators ) {
    // GET Requests
    app.get( '/', decorators.isAuth(views.general.get_frontpage) );

    // POST Requests
    // PUT Requests
};