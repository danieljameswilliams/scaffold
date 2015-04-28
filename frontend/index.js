// Require Libraries
var path = require('path');
var url = require('url');
var express = require('express');

var app = express();
var controllers = require('./controllers/controllers.js')( app );
var routes = require('./routes/routes.js')( app, controllers );

app.listen(3000);