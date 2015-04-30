// Require Libraries
var path = require('path');
var url = require('url');
var express = require('express');
var exphbs = require('express-handlebars');

// New Variables
var app = express();
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

// Get all global variables and functions
require('./globals/globals.js');

var controllers = require('./controllers/controllers.js')( app );
var routes = require('./routes/routes.js')( app, controllers );

app.listen(3000);