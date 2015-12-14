var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var nconf = require('nconf');


nconf.argv().env().file({ file: 'configs/' + process.env['NODE_ENV'] + '.json' });

var app = express();

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var client = mongoose.connect('mongodb://localhost:27017/local');
var db = mongoose.connection;

db.once('open', function() {
    var controllers = require('./controllers/controllers.js')( app );
    var decorators = require('./decorators/decorators.js')( app );
    var routes = require('./routes/routes.js')( app, controllers, decorators );
});

db.once('error', function( err ) {
    console.log('Database: %s', err.message);
});

app.listen( nconf.get('http:port') );
console.log('Listening on port (%s)', nconf.get('http:port'));
