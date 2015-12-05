var Q = require("q");

function get( request, response ) {
    return response.json({'users': [{'hello': 'world'}]});
}


////////////////////
///// PARTIALS /////
////////////////////



//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
    get: get
};