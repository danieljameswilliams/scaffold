var passwordHash = require('password-hash');
var crypto = require('crypto');
var Q = require("q");

var User = require('../../../models/user.js');
var AuthToken = require('../../../models/authtoken.js');
var authManual = require('./_auth_manual.js');


function login( request, response ) {
  var username = request.body.username;
  var password = request.body.password;

  var getUser = getUser( username );

  getUser.then(function( user ) {
    var getHttpResponse = authManual.buildHttpResponse( response, user );

    getHttpResponse.then(function( context ) {
      return response.json(context);
    });
  });

  getUser.fail(function( errorObj ) {
    if( errorObj.statusCode == 403 ) {
      return response.send(403);
    }
    else if( errorObj.statusCode == 500 ) {
      return response.send(500);
    }
  });
}


////////////////////
///// PARTIALS /////
////////////////////

function getUser() {
  User.findOne({ 'username': username, 'isStaff': true }, function( error, user ) {
    if( error ) {
      var errorObj = { 'statusCode': 500, 'message': error.message };
      deferred.reject(errorObj);
    }
    else if( user && !passwordHash.verify(password, user.password) ) {
      var errorObj = { 'statusCode': 403, 'message': 'Password is incorrect' };
      deferred.reject(errorObj);
    }
    else if( user ) {
      deferred.resolve( user );
    }
    else {
      var errorObj = { 'statusCode': 204, 'message': 'No username registered' };
      deferred.reject(errorObj);
    }
  });
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = {
  login: login,
  getUser: getUser
};