var util = require("util");
var nconf = require('nconf');

var helpers = require('helpers/helpers.js');


function create( request, response, next ) {
    var fields = 'userId, username, email, firstName, lastName';
    var url = util.format('%s://%s/create/manual', nconf.get('api:protocol'), nconf.get('api:host'));

    var postData = {
        apiKey: nconf.get('api:key'),
        fields: fields,
        firstName: request.body['firstName'],
        lastName: request.body['lastName'],
        username: request.body['username'],
        password: request.body['password']
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

        if( request.body['redirect'] ) {
            return response.redirect(request.body['redirect']);
        }
        else {
            return response.json(result);
        }
    });

    requestResponse.fail(function( errorObj ) {
        try {
            // TODO: Make User Creation ASYNC in client.
            console.log('[%s - %s]: %s', errorObj.statusCode, errorObj.statusMessage, errorObj.message);
            return response.redirect('/bruger/opret?error=' + errorObj.statusMessage);
        }
        catch( error ) {
            return next(error);
        }
    });
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = create;