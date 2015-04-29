// In this main file, we instanciate all controllers to the global controllers object.
// Every controller has it's own folder, to split each function into a seperate file, for less code in a single file.

module.exports = function() {
  return {
  	general: require('./general/general.js'),
  	user: require('./user/user.js')
  }
}//(); QUESTION: Why should this export not have ();, but ./user/user.js should?