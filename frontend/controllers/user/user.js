module.exports = function() {
  return {
    get_signup: require('./partials/_get_signup.js'),

    // API
    auth_manual: require('./partials/_auth_manual.js'),
    auth_facebook: require('./partials/_auth_facebook.js'),
    signup_manual: require('./partials/_signup_manual.js'),
    add_facebook: require('./partials/_add_facebook.js')
  }
}();