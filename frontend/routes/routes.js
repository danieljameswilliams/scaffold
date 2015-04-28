// Adding attributes to the global routes object.

module.exports = function( app, controllers ) {
  return {
    user: require('./partials/user.js')( app, controllers )
  };
};