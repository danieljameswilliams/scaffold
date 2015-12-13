var inquirer = require("inquirer");
var request = require("request");
var Q = require("q");

var questions = [
    {
        type: "input",
        name: "firstName",
        message: "What's the first name?:"
    },
    {
        type: "input",
        name: "lastName",
        message: "What's the last name?:"
    },
    {
        type: "input",
        name: "username",
        message: "What's the username (also e-mail)?:"
    },
    {
        type: "password",
        name: "password",
        message: "What's the password?:"
    },
];

inquirer.prompt( questions, function( answers ) {
    var getUser = _createStaffUser( answers, '5aad5774-b46d-46d1-b831-b5c03b7cd9ce' );

    getUser.then(function( user ) {
        console.log('User created');
        return
    });

    getUser.fail(function( errorObj ) {
        if( errorObj.statusCode == 403 ) {
            console.log('You don\'t have access to the API');
        }
        else if ( errorObj.statusCode == 409 ) {
            console.log('There is already a user with this username');
        }
        else {
            console.log('Something went wrong.');
        }
        return
    });
});

function _createStaffUser( userData, guid ) {
    var deferred = Q.defer();

    userData.guid = guid;

    request({
        url: 'http://localhost:9000/create/staff',
        method: 'POST',
        json: true,
        body: userData
    }, function ( error, response, body ) {
        if( error ) {
            var errorObj = { 'statusCode': 500, 'message': data.message };
            deferred.reject(errorObj);
        }
        else if( response.statusCode == 200 ) {
            deferred.resolve(body);
        }
        else {
            var errorObj = { 'statusCode': response.statusCode, 'message': response.statusMessage };
            deferred.reject(errorObj);
        }
    });

    return deferred.promise;
}