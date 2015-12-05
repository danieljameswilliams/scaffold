// Adding attributes to the global routes object.

module.exports = function( app, controllers, decorators ) {
  return {
    general: require('./partials/general.js')( app, controllers, decorators ),
    user: require('./partials/user.js')( app, controllers, decorators )
  };
};