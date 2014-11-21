var express = require('express');
var path = require('path');
var config = require("./config/config");
var dirname = __dirname;
var app = express();

// view engine setup
app.set('views', path.join(dirname, 'app/views'));
app.set('view engine', 'ejs');

// setup DB url
app.set("dbUrl", config.db[process.env.NODE_ENV]);

// Load all middleware
require("./config/middleware")(app, dirname); 

// Load all routes
require("./config/routes")(app, dirname);

module.exports = app;