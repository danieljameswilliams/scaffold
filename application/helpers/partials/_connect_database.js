var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose');
var Q = require("q");


function connectDatabase() {
    var deferred = Q.defer();

    if( mongoose.connection.readyState == 0 ) {
        var client = mongoose.connect('mongodb://localhost:27017/local');
        var db = mongoose.connection;

        autoIncrement.initialize(db);

        db.once('open', function() {
            deferred.resolve();
        });

        db.once('error', function( error ) {
            var errorObj = { statusCode: 500, message: error.message };
            deferred.reject(errorObj);
        });
    }
    else {
        deferred.resolve();
    }

    return deferred.promise;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = connectDatabase;