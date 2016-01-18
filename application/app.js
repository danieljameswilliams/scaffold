var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var nconf = require('nconf');

var helpers = require('helpers/helpers.js');


nconf.argv().env().file({ file: 'configs/' + process.env['NODE_ENV'] + '.json' });

var app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var getDatabaseConnection = helpers.connectDatabase(process.env['NODE_ENV']);

getDatabaseConnection.then(function() {
    var utilities = require('utilities/utilities.js');

    var controllers = require('./controllers/controllers.js');
    var decorators = require('./decorators/decorators.js');
    var routes = require('./routes/routes.js')( app, controllers, decorators );

    app.use(function( error, request, response, next ) {
        if( error ) {
            utilities.logger.info(error.message, {
                module: 'Error Caught by "Global Error Handler"',
                method: error.message,
                stack: error.stack,
                type: 'System Error'
            });

            if( process.env['NODE_ENV'] !== 'production' ) {
                next(error);
            }

            setTimeout(function() {
                process.exit(1);
            }, 100);
        }
    });

    app.listen( nconf.get('http:port') );
    console.log('Listening on port (%s)', nconf.get('http:port'));
});

getDatabaseConnection.fail(function( error ) {
    console.log('Database: %s', error.message);
});