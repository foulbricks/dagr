var utils = require("../utils");
var should = require("should");
var async = require("async");
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
		
		it("should not be valid if reaches maximum limit of workspaces", function(done){
			var workspace = null;
			var callbacks = [];
			for(var i = 0; LIMIT > i; i++){
				callbacks.push((function(i){
					return function(callback){
						workspace = new Workspace({name: "Test Workspace " + i, owner: testUser.id, minions: []});
						workspace.save(function(err, w){
							should.not.exist(err);
							callback();
						});
					}
				})(i));
			}
			
			async.series(callbacks.concat(
				function(){
					workspace = new Workspace({name: "Test Workspace", owner: testUser.id, minions: []});
					workspace.save(function(err, w){
						should.exist(err.errors.owner);
						done();
					});
				}
			));
		});
		
		it("should not be valid if name is not unique in set of user's workspaces", function(done){
			var workspace = new Workspace({name: "Test Workspace", owner: testUser.id, minions: []});
			workspace.save(function(err){
				should.not.exist(err);
				var w = new Workspace({name: "Test Workspace", owner: testUser.id, minions: []});
				w.save(function(e){
					should.exist(e.errors.name);
					done();
				});
			});
		});
		
		
		
	});
	
	
	
});