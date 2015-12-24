var Q = require('q');
var nconf = require('nconf');


function getFacebookTestUserAccessToken() {
    var deferred = Q.defer();

    var getAppToken = _getAppToken();

    getAppToken.then(function( appToken ) {
        var getTestUserToken = _getTestUserToken(appToken);

        getTestUserToken.then(function( testUserToken ) {
            deferred.resolve(testUserToken);
        });

        getTestUserToken.fail(function( errorObj ) {
            deferred.reject(errorObj);
        });
    });

    getAppToken.fail(function( errorObj ) {
        deferred.reject(errorObj);
    });

    return deferred.promise;
}


////////////////////
///// PARTIALS /////
////////////////////

function _getAppToken() {
    var deferred = Q.defer();

    var url = 'https://graph.facebook.com/oauth/access_token';
    var parameters = {
        client_id: nconf.get('facebook:app:id'),
        client_secret: nconf.get('facebook:app:secret'),
        grant_type: 'client_credentials'
    };

    var helpers = require('helpers/helpers.js');
    var fetchAppToken = helpers.httpRequest({
        url: helpers.addUrlParameters(url, parameters),
        method: 'GET',
        json: false
    });

    fetchAppToken.then(function( body ) {
        var appToken = body.split('access_token=')[1];
        deferred.resolve(appToken);
    });

    fetchAppToken.fail(function( errorObj ) {
        deferred.reject(errorObj);
    });

    return deferred.promise;
}

function _getTestUserToken( appToken ) {
    var deferred = Q.defer();

    var url = 'https://graph.facebook.com/' + nconf.get('facebook:app:id') + '/accounts/test-users';
    var parameters = {
        access_token: appToken
    };

    var helpers = require('helpers/helpers.js');
    var fetchTestUserToken = helpers.httpRequest({
        url: helpers.addUrlParameters(url, parameters),
        method: 'GET',
        json: true
    });

    fetchTestUserToken.then(function( body ) {
        var testUserIndex = body.data.findIndex(function( testUser ) {
            return testUser.id == nconf.get('facebook:user:id')
        });

        var testUserToken = body.data[testUserIndex].access_token;
        deferred.resolve(testUserToken);
    });

    fetchTestUserToken.fail(function( errorObj ) {
        deferred.reject(errorObj);
    });

    return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = getFacebookTestUserAccessToken;