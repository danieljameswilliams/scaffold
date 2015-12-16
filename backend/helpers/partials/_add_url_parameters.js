function httpRequest( url, parameters ) {
    var queryString = _serialize(parameters);

    var urlWithQueryString = url + '?' + queryString;

    return urlWithQueryString;
}


////////////////////
///// PARTIALS /////
////////////////////

function _serialize( parameters ) {
    var str = [];

    for( var param in parameters ) {
        if ( parameters.hasOwnProperty(param) ) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(parameters[param]));
        }
    }

    return str.join('&');
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = httpRequest;