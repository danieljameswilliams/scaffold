var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Schemas */
var userSchema  = new Schema({
  first_name: String,
  last_name: String,
  username: String,
  password: String,
  email: String,
  phone: String,
  birthdate: Date,
  facebookId: String,
  isStaff: { type: Boolean, default: false }
});

/* Models */
// mongoose.model({MODEL-NAME}, {SCHEMA-OBJECT}, {COLLECTION-NAME})
var userModel = mongoose.model('User', userSchema, 'Users');

module.exports = userModel;