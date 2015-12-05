// Adding attributes to the global routes object.

module.exports = function( app, controllers, decorators ) {
  return {
    authentication: require('./partials/authentication.js')( app, controllers, decorators ),
    user: require('./partials/user.js')( app, controllers, decorators )
  };
};