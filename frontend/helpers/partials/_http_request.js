var Q = require("q");
var request = require("request");


function httpRequest( options ) {
    var deferred = Q.defer();

    request(options, function( error, response, body ) {
        _onRequestCompleted.call(this, error, response, body, deferred);
    });

    return deferred.promise;
}


////////////////////
///// PARTIALS /////
////////////////////

function _onRequestCompleted( error, response, body, deferred ) {
    if( error ) {
        var errorObj = { 'statusCode': 500, 'message': error.errno };
        deferred.reject(errorObj);
    }
    else if( response.statusCode == 200 ) {
        deferred.resolve(body);
    }
    else {
        var errorObj = { 'statusCode': response.statusCode, 'statusMessage': response.statusMessage, 'message': body };
        deferred.reject(errorObj);
    }
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = httpRequest;