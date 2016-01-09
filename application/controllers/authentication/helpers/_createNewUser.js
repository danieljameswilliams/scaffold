var Q = require("q");

var User = require('models/user.js');
var utilities = require('utilities/utilities.js');


function createNewUser( userObj ) {
    var deferred = Q.defer();

    var user = new User(userObj);

    user.save(function( error, user ) {
        if( error ) {
            var errorObj = { 'statusCode': 500, 'message': error.message };
            deferred.reject(errorObj);

            utilities.logger.error(error.message, {
                module: 'Authentication',
                method: 'Create New User Helper Saving',
                type: 'System Error'
            });
        }
        else if( user ) {
            deferred.resolve(user);
        }
        else {
            var errorObj = { 'statusCode': 500, 'message': 'Saved user, but got no user in return.' };
            deferred.reject(errorObj);

            utilities.logger.error('No errors, but no user either.', {
                module: 'Authentication',
                method: 'Create New User Helper',
                type: 'System Error'
            });
        }
    });

    return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = createNewUser;