var util = require("util");
var nconf = require('nconf');

var helpers = require('helpers/helpers.js');


function create( request, response ) {
    var url = util.format('%s://%s/account/facebook', nconf.get('api:protocol'), nconf.get('api:host'));

    var postData = {
        apiKey: nconf.get('api:key'),
        accessToken: request.body['accessToken'],
        userId: request.body['userId'],
        username: request.body['username'],
        userToken: request.cookies['usertoken']
    };

    var requestResponse = helpers.httpRequest({
        url: url,
        method: 'POST',
        json: true,
        body: postData
    });

    requestResponse.then(function() {
        return response.sendStatus(200);
    });

    requestResponse.fail(function( errorObj ) {
        if( errorObj.statusCode == 403 ) {
            return response.sendStatus(403);
        }
        else if( errorObj.statusCode == 400 ) {
            return response.sendStatus(400);
        }
        else if( errorObj.statusCode == 401 ) {
            return response.sendStatus(500);
        }
        else {
            return response.sendStatus(500);
        }
    });
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = create;