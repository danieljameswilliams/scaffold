var Q = require("q");
var util = require("util");
var nconf = require('nconf');

var helpers = require('helpers/helpers.js');


function isAuth( callback ) {
    return function ( request, response, next ) {
        var apiKey = request.body['apiKey'] || request.query['apiKey'];

        // TODO: Make an API key for each platform.
        /*
            Frontend Development: 09651661-6e79-4930-a9b3-075659c4636f
            Frontend Production: 573f4cb5-4a8d-4569-a082-4f56a080a731
            Backend Development: 288b65eb-15ec-4299-87c2-46166eae5bd8
            Backend Production: d216cf0a-9756-442e-993d-f789f9d1fc94
            Application Development: 6beafb5e-c275-422a-b10d-e9152622111c
            Application Production: 48b74cba-603d-4f79-9619-494706c86aa8
        */
        if( apiKey && apiKey == nconf.get('api:key') ) {
            return callback( request, response, next );
        }
        else {
            return response.sendStatus(401);
        }
    };
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = isAuth;