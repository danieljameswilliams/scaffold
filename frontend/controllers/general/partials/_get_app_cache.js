// The application cache is a native feature, that makes it possible to keep using the app offline.
module.exports = function( request, response ) {
	response.set( 'Content-Type', 'text/cache-manifest' );
	response.set( 'Cache-Control', 'no-store, no-cache' );
	response.set( 'Expires', '-1' );
	response.render( 'configs/cache_manifest', { layout: null } );
}