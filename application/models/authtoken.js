var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Schemas */
var authTokenSchema  = new Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  token: String,
  permission: String
});

/* Models */
// mongoose.model({MODEL-NAME}, {SCHEMA-OBJECT}, {COLLECTION-NAME})
var authTokenModel = mongoose.model('AuthToken', authTokenSchema, 'AuthTokens');

module.exports = authTokenModel;