var http = require('http');

module.exports = function( callback ) {
  return function ( request, response ) {
    var url = 'http://localhost:8080/auth/staff';
    http.get(url, function( httpResponse ) {
      httpResponse.on('data', function ( chunk ) {
        var data = JSON.parse(chunk);

        if( httpResponse.statusCode == 200 ) {
          request.isLoggedIn = true;
        }
        else {
          request.isLoggedIn = false;
        }

        return callback( request, response );
      });
    });
  };
}