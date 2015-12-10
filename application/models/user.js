var mongoose = require('mongoose');
var Schema = mongoose.Schema;


////////////////////
///// PARTIALS /////
////////////////////

var authActivitySchema = new Schema({
  type: String,
  action: String,
  datetime: String,
  environment: {
    ipAddress: String,
    device: String,
    operatingSystem: String,
    browser: String
  },
  location: {
    latitude: String,
    longitude: String
  }
});


//////////////////
///// SCHEMA /////
//////////////////

var userSchema  = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String,
  phone: String,
  birthDate: Date,
  facebookId: String,
  isStaff: { type: Boolean, default: false },
  authActivity: [authActivitySchema]
});


/////////////////
///// MODEL /////
/////////////////

// mongoose.model({MODEL-NAME}, {SCHEMA-OBJECT}, {COLLECTION-NAME})
var User = mongoose.model('User', userSchema, 'Users');


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = User;