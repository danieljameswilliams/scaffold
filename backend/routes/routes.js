// Adding attributes to the global routes object.

module.exports = function( app, controllers, decorators ) {
  return {
    user: require('./partials/user.js')( app, controllers, decorators )
  };
};