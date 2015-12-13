var express = require('express');
var exphbs = require('express-handlebars');
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

var controllers = require('./controllers/controllers.js')( app );
var decorators = require('./decorators/decorators.js')( app );
var routes = require('./routes/routes.js')( app, controllers, decorators );

app.listen(5000);
console.log('Listening on port 5000');