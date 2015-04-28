module.exports = function( app ) {
  return {
    get_current: require('./partials/_get_current.js'),
    get_specific: require('./partials/_get_specific.js'),
    get_full_list: require('./partials/_get_full_list.js')
  }
}();