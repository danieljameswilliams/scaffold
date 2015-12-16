function page( request, response ) {
    var context = {};

    if( request.query.async ) {
        response.json( context );
    }
    else {
        response.render('user_create', context);
    }
}


//////////////////
/// PUBLIC API ///
//////////////////

module.exports = page;