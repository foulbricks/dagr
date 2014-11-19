var express = 			require("express")
var path = 				require('path');

// From node modules
var favicon = 			require('static-favicon');
var logger = 			require('morgan');
var cookieParser = 		require('cookie-parser');
var bodyParser = 		require('body-parser');

//Custom


module.exports = function(app, dir){
	app.use(favicon());
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());
	app.use(cookieParser());
	app.use(express.static(path.join(dir, 'public')));
}