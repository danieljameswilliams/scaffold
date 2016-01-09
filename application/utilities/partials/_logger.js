var winston = require('winston');
var nconf = require('nconf');

require('winston-mongodb').MongoDB;

var logger = new winston.Logger({
    transports: [
        new winston.transports.MongoDB({
            db : nconf.get('api:database'),
            collection: 'logs'
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = logger;