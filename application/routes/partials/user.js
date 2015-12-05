module.exports = function( app, controllers, decorators ) {
    // GET Requests
    app.get( '/users', controllers.user.users.get );

    // POST Requests
    // PUT Requests
};