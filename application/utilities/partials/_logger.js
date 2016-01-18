var winston = require('winston');
var nconf = require('nconf');

require('winston-mongodb').MongoDB;

var logger = new winston.Logger({
    transports: [
        new winston.transports.MongoDB({
            db : nconf.get('api:database'),
            collection: 'logs'
        })
    ],
    exitOnError: false
});


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = logger;