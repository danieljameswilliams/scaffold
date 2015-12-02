var http = require('http');
var Q = require("q");


function isAuth( callback ) {
  return function ( request, response ) {
    var token = request.cookies.usertoken;

    if( token ) {
      var validateAuthToken = _validateAuthToken( token );

      validateAuthToken.then(function( user ) {
        request.isLoggedIn = true;
        request.user = user;
        return callback( request, response );
      });

      validateAuthToken.fail(function( errorObj ) {
        request.isLoggedIn = false;
        request.user = null;
        return callback( request, response );
      });
    }
    else {
      request.isLoggedIn = false;
      request.user = null;
      return callback( request, response );
    }
  };
}


////////////////////
///// PARTIALS /////
////////////////////

function _validateAuthToken( token ) {
  var deferred = Q.defer();
  var url = 'http://localhost:9000/auth?permission=customer&token=' + token;

  http.get(url, function( response ) {
    response.setEncoding('binary');
    response.on('data', function ( data ) {
      if( response.statusCode == 200 ) {
        data = JSON.parse(data);
        deferred.resolve(data.user);
      }
      else if ( response.statusCode == 403 ) {
        var errorObj = { 'statusCode': 403, 'message': data.message };
        deferred.reject(errorObj);
      }
      else {
        var errorObj = { 'statusCode': 500, 'message': data.message };
        deferred.reject(errorObj);
      }
    });
  });

  return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = isAuth