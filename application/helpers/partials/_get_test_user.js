var Q = require("q");


function getTestUser() {
    var deferred = Q.defer();

    var models = require('../../models/models.js');

    models.User.findOne({ username: 'test@example.com' }, function( error, user ) {
        if( error ) {
            deferred.reject( error );
        }
        else if( user ) {
            deferred.resolve(user);
        }
        else {
            var errorObj = { statusCode: 500, message: 'No user, and no errors' };
            deferred.reject(errorObj);
        }
    });

    return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = getTestUser;