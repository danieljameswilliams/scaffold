function page( request, response ) {
    var context = {
        isLoggedIn: request.isLoggedIn,
        user: request.user
    };

    if( request.query.async ) {
        response.json( context );
    }
    else {
        response.render('frontpage', context);
    }
}


//////////////////
/// PUBLIC API ///
//////////////////

module.exports = page;