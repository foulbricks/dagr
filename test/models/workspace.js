var utils = require("../utils");
var should = require("should");
var config = require("../../config/config");
var User = require("../../app/models/user");
var Workspace = require("../../app/models/workspace");
var Factory = require("../support/factories");
var testUser = null;
var testWorkspace = null;

var LIMIT = config.workspace_limit;

describe("Workspace", function(){
	beforeEach(function(done){
		Factory.build("user", function(user){
			testUser = user;
			testUser.save(function(err, u){
				done();
			});
		});
	});
	
	describe("validation", function(){
		it("should not be valid without name", function(done){
			var workspace = new Workspace({name: "", owner: testUser.id, minions: []});
			workspace.save(function(err, w){
				should.exist(err.errors.name);
				done();
			});
		});
		
		it("should not be valid without owner", function(done){
			var workspace = new Workspace({name: "Test Workspace", owner: null, minions: []});
			workspace.save(function(err, w){
				should.exist(err.errors.owner);
				done();
			});
		});
		
		// it("should not be valid if reaches maximum limit of workspaces", function(done){
		// 	var workspace = null;
		// 	for(var i = 0; i > LIMIT; i++){
		// 		workspace = new Workspace({name: "Test Workspace " + i, owner: testUser.id, minions: []});
		// 		workspace.save(function(err, w){
		// 			should.not.exist(err);
		// 		});
		// 	}
		// 	
		// 	workspace = new Workspace({name: "Test Workspace", owner: testUser.id, minions: []});
		// 	workspace.save(function(err, w){
		// 		should.exist(err.errors.owner);
		// 		done();
		// 	});
		// });
		
		
		
	});
	
	
	
});