var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// New Variables
var app = express();

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var templatesFolder = __dirname + '/public/templates';
var hbs = exphbs.create({
	layoutsDir: templatesFolder + '/layouts',
	defaultLayout: templatesFolder + '/layouts/main',
	partialsDir: templatesFolder + '/partials'
});

// Register 'hbs.engine' with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', templatesFolder);

// Set the public folder as the static folder
app.use( express.static(__dirname + '/public') );

var client = mongoose.connect('mongodb://localhost:27017/local');
var db = mongoose.connection;

db.once('open', function() {
  var controllers = require('./controllers/controllers.js')( app );
  var routes = require('./routes/routes.js')( app, controllers );
});

db.once('error', function( err ) {
  console.log('Database: ' + err.message);
});

app.listen(3000);