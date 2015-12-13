var AuthToken = require('../../../models/authtoken.js');

var Q = require("q");


function validateAuthToken( request, response ) {
    response.setHeader( 'Access-Control-Allow-Origin', '*' );

    var token = request.query.token;
    var permission = request.query.permission;

    var getAuthToken = _getAuthToken( token, permission );

    getAuthToken.then(function( tokenResponse ) {
        return response.json( tokenResponse.user.toObject() );
    });

    getAuthToken.fail(function( errorObj ) {
        if( errorObj.statusCode == 403 ) {
            return response.sendStatus(403);
        }
        else if( errorObj.statusCode == 500 ) {
            return response.sendStatus(500);
        }
    });
}


////////////////////
///// PARTIALS /////
////////////////////

function _getAuthToken( token, permission ) {
    var deferred = Q.defer();

    AuthToken.findOne({ 'token': token, 'permission': permission }).populate('user').exec(function( error, tokenResponse ) {
        if( error ) {
            var errorObj = { 'statusCode': 500, 'message': error.message };
            deferred.reject(errorObj);
        }
        else if( tokenResponse ) {
            deferred.resolve(tokenResponse);
        }
        else {
            var errorObj = { 'statusCode': 403, 'message': 'No authToken found' };
            deferred.reject(errorObj);
        }
    });

    return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
    validate: validateAuthToken,
};