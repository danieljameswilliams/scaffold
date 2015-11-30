var path = require('path'); // QUESTION: Is this initialized multiple times, in every controller partial?
var url = require('url'); // QUESTION: Is this initialized multiple times, in every controller partial?

module.exports = function( request, response ) {
	// Getting all information about the current request.url
	var location = url.parse( request.url, true );

	// Finds the package.json location and create a path
	var filePath = path.resolve('package.json');

	// Fetch the global config file
	var config = require( filePath );

	// Set the context to the current version number
	var context = { version: config.version };

	// Checking if the request has a async query-parameter,
	// We will only allow this data to be recieved async.
	if( location.query.async ) {
		return response.json( context );
	}
}