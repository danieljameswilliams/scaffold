module.exports = function() {
  return {
    get_frontpage: require('./partials/_get_frontpage.js'),
    get_version: require('./partials/_get_version.js')
  }
}();