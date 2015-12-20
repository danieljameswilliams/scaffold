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

var getDatabaseConnection = helpers.connectDatabase();

getDatabaseConnection.then(function() {
    var controllers = require('./controllers/controllers.js');
    var decorators = require('./decorators/decorators.js');
    var routes = require('./routes/routes.js')( app, controllers, decorators );
});

getDatabaseConnection.fail(function( error ) {
    console.log('Database: %s', error.message);
});

app.listen( nconf.get('http:port') );
console.log('Listening on port (%s)', nconf.get('http:port'));
