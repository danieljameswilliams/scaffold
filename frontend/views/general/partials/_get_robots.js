module.exports = function( request, response ) {
  response.set( 'Content-Type', 'text/plain' );
  response.render( 'configs/robots', { layout: null } );
}