var crypto = require('crypto');
var Q = require("q");
var moment = require('moment');
var extend = require('extend');

var AuthToken = require('models/authtoken.js');
var helpers = require('helpers/helpers.js');


/**
 * Lets actually login the user we have retrieved.
 */
function login( request, response, user, permission ) {
    var deferred = Q.defer();
    var getUniqueToken = _generateUniqueToken();

    getUniqueToken.then(function( token ) {
        var authTokenData = {
            user: user._id,
            token: token,
            permission: permission
        };

        AuthToken.update({ 'user': user._id, 'permission': permission }, authTokenData, { upsert: true }, function( error ) {
            if( error ) {
                console.log(error);
            }
        });

        updateAuthActivity( request, user );

        // Clean the user model for redundant info,
        var fields = request.body.fields;
        var userObj = helpers.cleanModel(user, fields);

        context = {
            user: userObj,
            token: token
        };

        deferred.resolve(context);
    });

    return deferred.promise;
}


////////////////////
///// PARTIALS /////
////////////////////

/**
 * Generating a unique token to use as login auth.
 * TODO: Should be checking database for making sure it's unique.
 */
function _generateUniqueToken() {
    var deferred = Q.defer();

    crypto.randomBytes(48, function(ex, buf) {
        var token = buf.toString('hex');
        deferred.resolve(token);
    });

    return deferred.promise;
}

/**
 * Add a line to the users Authentication Activity,
 * .. to keep a log of when and where the user has been used.
 */
function updateAuthActivity( request, user, overrides ) {
    var deferred = Q.defer();

    var authActivityData = {
        type: 'full',
        action: 'login',
        datetime: moment().format('YYYY-MM-DDThh:mm:ssZ'),
        environment: {
            ipAddress: '',
            device: '',
            operatingSystem: '',
            browser: ''
        },
        location: {
            latitude: '',
            longitude: ''
        }
    };

    extend(authActivityData, authActivityData, overrides);

    user.authActivity.push( authActivityData );

    user.save(function( error, user ) {
        if( error ) {
            var errorObj = { 'statusCode': 500, 'message': error.message };
            deferred.reject(errorObj);
        }
        else if( user ) {
            deferred.resolve(user);
        }
        else {
            var errorObj = { 'statusCode': 500, 'message': 'No errors, but no user either.' };
            deferred.reject(errorObj);
        }
    });

    return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
    login: login,
    updateAuthActivity: updateAuthActivity
};