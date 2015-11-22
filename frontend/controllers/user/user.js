module.exports = function() {
  return {
    get_signup: require('./partials/_get_signup.js'),

    // API
    get_current: require('./partials/_get_current.js'),
    get_specific: require('./partials/_get_specific.js'),
    get_full_list: require('./partials/_get_full_list.js'),
    auth_manual: require('./partials/_auth_manual.js'),
    auth_facebook: require('./partials/_auth_facebook.js'),
    signup_manual: require('./partials/_signup_manual.js'),
    add_facebook: require('./partials/_add_facebook.js')
  }
}();