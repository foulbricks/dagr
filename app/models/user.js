var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var validator = require("./lib/validation-utils");
var Workspace = require("./workspace");

var Schema = mongoose.Schema;
var emailRegExp = /^([\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4})+$/i

var userSchema = new Schema({
	name: { 
		first: 	{ type: String, required: "First Name is Required!" }, 
		last: 	{ type: String, required: "Last Name is Required!" }
	},
	email: 		{ type: String, required: "Invalid email", lowercase: true, match: emailRegExp },
	password: 	{ type: String, required: "Password is Required!" },
	salt: 		{ type: String },
	title: 		{ type: String, default: "Hacker" },
	created_at:	{ type: Date },
	updated_at:	{ type: Date, 	default: new Date },
	workspaceInvites: [{ type: Schema.Types.ObjectId, ref: "Workspace" }]
});

// VALIDATION - Password must be more than 6 characters
userSchema.path("password").validate(validator.minLength(6), "Password must be more than 6 characters");

// VALIDATION - Email must be unique
userSchema.path("email").validate(function(val, respond){
	var self = this;
	this.model("User").findUserByEmail(val, function(err, user){
		if(err) respond(false);
		user && user.id != self.id ? respond(false) : respond();
	});
}, "You already have an account.");

// PRE SAVING HOOK - PASSWORD HASHING - Set salt, Hash Password if it has been updated.
userSchema.pre("save", function(next){
	var user = this;
	
	if(!user.isModified("password")) return next(); // Check if it has been modified, if not, return
	
	bcrypt.genSalt(12, function(err, salt){
		if(err) return next(err);
		user.salt = salt; // Set salt
		
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err) return next(err);
			user.password = hash; // Set hash
			next();
		});
	});
	
});

// PRE SAVING HOOK - SET CREATED AT ON FIRST SAVE
userSchema.pre("save", function(next){
	if(!this.created_at) this.created_at = new Date;
	next();
});

// STATICS - FINDER - Return user by email
userSchema.static("findUserByEmail", function(email, cb){
	return this.findOne({email: email}, cb);
});

// STATICS - Authenticate user with email/password
userSchema.static("authenticate", function(email, pass, cb){
	this.findUserByEmail(email, function(err, user){
		if(err) return cb(err);
		if(!user) return cb();
		bcrypt.hash(pass, user.password, function(err, hash){
			if(err) return cb(err);
			if(hash == user.password) return cb(null, user);
			cb();
		});
	});
});

// METHOD - Overwrite toJSON to obfuscate some attributes
userSchema.method("toJSON", function(){
	var user = this;
	return {
		id: user.id,
		name: [user.name.first, user.name.last].join(" "),
		email: user.email,
		title: user.title,
		invites: user.workspaceInvites
	}
});

module.exports = mongoose.model("User", userSchema);
