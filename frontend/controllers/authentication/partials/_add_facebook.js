var util = require("util");
var nconf = require('nconf');

var helpers = require('helpers/helpers.js');


function create( request, response ) {
    var fields = 'userId, username, email, firstName, lastName';
    var url = util.format('%s://%s/account/facebook', nconf.get('api:protocol'), nconf.get('api:host'));

    var postData = {
        fields: fields,
        accessToken: request.body['accessToken'],
        userId: request.body['userId'],
        username: request.body['username']
    };

    var requestResponse = helpers.httpRequest({
        url: url,
        method: 'POST',
        json: true,
        body: postData
    });

    requestResponse.then(function( result ) {
        var token = result.token;

        return response.sendStatus(200);
    });

    requestResponse.fail(function( errorObj ) {
        if( errorObj.statusCode == 403 ) {
            return response.sendStatus(403);
        }
        else if( errorObj.statusCode == 400 ) {
            return response.sendStatus(400);
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