var express = require('express');
var exphbs = require('express-handlebars');
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

var controllers = require('./controllers/controllers.js');
var views = require('./views/views.js');
var decorators = require('./decorators/decorators.js');
var routes = require('./routes/routes.js')( app, controllers, views, decorators );

app.listen( nconf.get('http:port') );
console.log('Listening on port (%s)', nconf.get('http:port'));