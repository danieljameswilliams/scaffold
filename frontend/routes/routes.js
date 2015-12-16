// Adding attributes to the global routes object.

module.exports = function( app, controllers, views, decorators ) {
  return {
    general: require('./partials/general.js')( app, controllers, views, decorators ),
    authentication: require('./partials/authentication.js')( app, controllers, views, decorators )
  };
};