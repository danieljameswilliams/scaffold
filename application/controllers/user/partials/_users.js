var Q = require("q");

var User = require('models/user.js');


function get( request, response ) {
    var getUsers = _fetchUsers();

    getUsers.then(function( users ) {
        return response.json( users );
    });

    getUsers.fail(function( errorObj ) {
        if( errorObj.statusCode == 500 ) {
            return response.sendStatus(500);
        }
    });
}


////////////////////
///// PARTIALS /////
////////////////////

function _fetchUsers() {
    var deferred = Q.defer();

    User.find({}, { password: 0 }, function( error, users ) {
        if ( error ) {
            var errorObj = {'statusCode': 500, 'message': error.message};
            deferred.reject(errorObj);
        }
        else if ( users ) {

            deferred.resolve( users );
        }
    }).lean();

    return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
    get: get
};