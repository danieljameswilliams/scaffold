module.exports = function() {
  return {
    get_frontpage: require('./partials/_get_frontpage.js'),
    get_version: require('./partials/_get_version.js'),
    get_app_cache: require('./partials/_get_app_cache.js')
  }
}();