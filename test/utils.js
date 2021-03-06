"use strict"

var config = require("../config/config");
var mongoose = require("mongoose");
mongoose.models = {};
mongoose.modelSchemas = {};

process.env.NODE_ENV = "test";

beforeEach(function(done){
	
	// Clears all collections on database
	function clearDB(){
		for(var i in mongoose.connection.collections){
			mongoose.connection.collections[i].drop(function(){});
		}
		return done();
	}
	
	// Connect using test database, then clear DB
	if(mongoose.connection.readyState === 0){
		mongoose.connect(config.db.test, function(err){
			if(err)throw err;
			return clearDB();
		});
	}
	else {
		return clearDB();
	}
	
});

afterEach(function(done){
	mongoose.disconnect();
	return done();
});