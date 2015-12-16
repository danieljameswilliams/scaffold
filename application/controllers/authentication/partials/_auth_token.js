var Q = require("q");

var AuthToken = require('models/authtoken.js');
var helpers = require('helpers/helpers.js');
var updateAuthActivity = require('../helpers/_login.js').updateAuthActivity;


function validate( request, response ) {
    response.setHeader( 'Access-Control-Allow-Origin', '*' );

    var fields = request.query['fields'];
    var token = request.query['token'];
    var permission = request.query['permission'];
    var addToActivity = request.query['activity'];

    var getAuthToken = _getAuthToken( token, permission );

    getAuthToken.then(function( tokenResponse ) {
        var user = tokenResponse.user;

        if( addToActivity == 'true' ) {
            updateAuthActivity( request, user, { type: 'partial' } );
        }

        var userObj = helpers.cleanModel(user, fields);
        return response.json( userObj );
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
    validate: validate
};