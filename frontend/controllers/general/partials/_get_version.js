var path = require('path'); // QUESTION: Why can't i just use the path variable, passed in?

module.exports = function( app ) {
	var response = app.res;

	// Finds the package.json location and create a path
	var filePath = path.resolve('package.json');

	// Fetch the config file
	var config = require( filePath );

	// Save the current version number
	var version = { version: config.version };

	return response.json( version );
}