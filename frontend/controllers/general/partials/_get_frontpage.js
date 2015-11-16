module.exports = function( request, response ) {
	response.set( 'Content-Type', 'text/html' );
	response.set( 'Cache-Control', 'no-store, no-cache' );
	response.set( 'Expires', '-1' );

	// Set the context to the page data
	var context = { page: null };

	//////////////////
	/// PUBLIC API ///
	//////////////////

	if( request.query.async ) {
		// We send some JSON to be handled in the frontend.
		response.json( context );
	}
	else {
		// We want to serve some pre-rendered HTML, due to either a server-request or noscript.
		response.render('frontpage', context);
	}
}