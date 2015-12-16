function httpRequest( url, parameters ) {
    var queryString = _serialize(parameters);

    var urlWithQueryString = url + '?' + queryString;

    return urlWithQueryString;
}


////////////////////
///// PARTIALS /////
////////////////////

function _serialize( parameters ) {
    var querystring = [];

    for( var param in parameters ) {
        if ( parameters.hasOwnProperty(param) ) {
            querystring.push(encodeURIComponent(param) + "=" + encodeURIComponent(parameters[param]));
        }
    }

    return querystring.join('&');
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = httpRequest;