var utilities = require('utilities/utilities.js');

module.exports = function( app, controllers, decorators ) {
    return {
        authentication: require('./partials/authentication.js')( app, controllers, decorators ),
        user: require('./partials/user.js')( app, controllers, decorators )
    };
};