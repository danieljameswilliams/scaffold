var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//////////////////
///// SCHEMA /////
//////////////////

var authTokenSchema  = new Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  token: String,
  permission: String
});


/////////////////
///// MODEL /////
/////////////////

// mongoose.model({MODEL-NAME}, {SCHEMA-OBJECT}, {COLLECTION-NAME})
var AuthToken = mongoose.model('AuthToken', authTokenSchema, 'AuthTokens');


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = AuthToken;