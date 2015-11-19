var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Schemas */
var authTokenSchema  = new Schema({
  username: String,
  token: String,
});

/* Models */
// mongoose.model({MODEL-NAME}, {SCHEMA-OBJECT}, {COLLECTION-NAME})
var authTokenModel = mongoose.model('AuthToken', authTokenSchema, 'AuthTokens');

module.exports = authTokenModel;