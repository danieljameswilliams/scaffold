var util = require("util");
var nconf = require('nconf');

var helpers = require('helpers/helpers.js');


function create( request, response ) {
    var fields = 'userId, username, email, firstName, lastName, facebookId';
    var url = util.format('%s://%s/authenticate/facebook', nconf.get('api:protocol'), nconf.get('api:host'));

    var postData = {
        fields: fields,
        accessToken: request.body['accessToken'],
        userId: request.body['userId']
    };

    var requestResponse = helpers.httpRequest({
        url: url,
        method: 'POST',
        json: true,
        body: postData
    });

    requestResponse.then(function( result ) {
        var token = result.token;

        response.cookie('usertoken', token, {
            httpOnly: false,
            secure: false
        });

        return response.json(result);
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