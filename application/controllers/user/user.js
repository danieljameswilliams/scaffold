module.exports = function() {
  return {
    auth_token: require('./partials/_auth_token.js'),
    auth_manual: require('./partials/_auth_manual.js'),
    auth_facebook: require('./partials/_auth_facebook.js'),
    auth_staff: require('./partials/_auth_staff.js'),
    signup_manual: require('./partials/_signup_manual.js'),
    add_facebook: require('./partials/_add_facebook.js')
  }
}();