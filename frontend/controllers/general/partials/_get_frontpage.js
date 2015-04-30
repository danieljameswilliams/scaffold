var url = require('url'); // QUESTION: Is this initialized multiple times, in every controller partial?

var mockData = {
	meta: {
		lang: 'da_DK',
		title: 'Mock Title',
		description: 'Mock Description',
		keywords: 'Mock Keywords',
		canonical: '/mock-url',
		robots: 'noindex, nofollow'
	}
};

module.exports = function( request, response ) {
	// Getting all information about the current request.url
	var location = url.parse( request.url, true );

	// Set the context to the page data
	var context = { page: mockData };

	// Checking if the request has a async query-parameter,
	if( location.query.async ) {
		// We send some JSON to be handled in the frontend.
		response.json( context );
	}
	else {
		// We want to serve some pre-rendered HTML, due to either a server-request or noscript.
		response.render('frontpage', context);
	}
}