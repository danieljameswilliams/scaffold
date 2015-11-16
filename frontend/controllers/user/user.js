module.exports = function() {
  return {
    get_current: require('./partials/_get_current.js'),
    get_specific: require('./partials/_get_specific.js'),
    get_full_list: require('./partials/_get_full_list.js'),
    auth_manual: require('./partials/_auth_manual.js'),
    auth_facebook: require('./partials/_auth_facebook.js')
  }
}();