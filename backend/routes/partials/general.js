module.exports = function( app, controllers, decorators ) {
    // GET Requests
    app.get( '/', decorators.isAuth(controllers.general.get_frontpage) );

    // POST Requests
    // PUT Requests
};