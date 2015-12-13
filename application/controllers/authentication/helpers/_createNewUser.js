var Q = require("q");

var User = require('../../../models/user.js');


function createNewUser( userObj ) {
    var deferred = Q.defer();

    var user = new User(userObj);

    user.save(function( error, user ) {
        if( error ) {
            var errorObj = { 'statusCode': 500, 'message': error.message };
            deferred.reject(errorObj);
        }
        else if( user ) {
            deferred.resolve(user);
        }
        else {
            var errorObj = { 'statusCode': 500, 'message': 'Saved user, but got no user in return.' };
            deferred.reject(errorObj);
        }
    });

    return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = createNewUser;