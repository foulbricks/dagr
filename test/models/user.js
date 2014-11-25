var utils = require("../utils");
var should = require("should");
var User = require("../../app/models/user");
var Factory = require("../support/factories");
var testUser = null;

describe("User", function(){
	beforeEach(function(done){
		Factory.build("user", function(user){
			testUser = user;
		});
		done();
	});
	
	describe("Validation", function(){
		
		it("should not validate with empty first name", function(done){
			testUser.name.first = "";
			testUser.save(function(err){
				err.errors["name.first"].message.should.equal("First Name is Required!");
				done();
			});
		});
		
		it("should not validate with empty last name", function(done){
			testUser.name.last = "";
			testUser.save(function(err){
				err.errors["name.last"].message.should.equal("Last Name is Required!");
				done();
			});
		});
		
		it("should not validate with empty email", function(done){
			testUser.email = "";
			testUser.save(function(err){
				err.errors.email.message.should.equal("Invalid email");
				done();
			});
		});
		
		it("should not validate with empty password", function(done){
			testUser.password = "";
			testUser.save(function(err){
				err.errors.password.message.should.equal("Password is Required!");
				done();
			});
		});
		
		it("should not validate with invalid email format", function(done){
			testUser.email = "awdsome";
			testUser.save(function(err){
				err.errors.email.type.should.equal("regexp");
				done();
			});
		});
		
		it("should not validate with password less than 6 characters", function(done){
			testUser.password = "testo";
			testUser.save(function(err){
				err.errors.password.message.should.equal("Password must be more than 6 characters");
				done();
			});
		});
		
		it("should validate with valid user", function(done){
			var beforeUser = null;
			Factory.build("user", function(user){
				beforeUser = user;
			});
			
			testUser.save(function(err, createdUser){
				should.not.exist(err);
				createdUser.name.first.should.equal(beforeUser.name.first);
				createdUser.name.last.should.equal(beforeUser.name.last);
				createdUser.email.should.equal(beforeUser.email);
				createdUser.salt.should.not.equal(beforeUser.salt);
				createdUser.password.should.not.equal(beforeUser.password);
				createdUser.title.should.equal("Hacker");
				done();
			});
		});
	});
	
	describe("Pre saving hooks", function(){
		var beforeUser = null;
		
		beforeEach(function(done){
			Factory.build("user", function(user){
				beforeUser = user;
			});
			done();
		});
		
		
		it("should hash password and create salt", function(done){
			testUser.save(function(err, createdUser){
				createdUser.password.should.not.equal(beforeUser.password);
				createdUser.salt.should.not.equal(beforeUser.salt);
				done();
			});
		});
		
		it("should set created_at", function(done){
			testUser.save(function(err, createdUser){
				should.exist(createdUser.created_at);
				done();
			});
		});
		
	});
	
	describe("Statics depending on saved user", function(){
		
		beforeEach(function(done){
			testUser.save(function(err){
				done();
			});
		});
		
		describe("User#findUserByEmail", function(){
			it("should find an user by email", function(done){
				User.findUserByEmail(testUser.email, function(err, user){
					should.not.exist(err);
					should.exist(user.id);
					done();
				});
			});
		});
		
		describe("User#authenticate", function(){
			it("should authenticate user", function(done){
				Factory.build("user", function(user){
					User.authenticate(user.email, user.password, function(err, user){
						should.not.exist(err);
						should.exist(user.id);
						done();
					});
				});
			});
			
			it("should not authenticate user", function(done){
				User.authenticate("fakeemail@email.com", "fakepassword", function(err, user){
					should.not.exist(err);
					should.not.exist(user);
					done();
				});
			});
			
		});
		
	});
});