var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var validator = require("./lib/validation-utils");
var Schema = mongoose.Schema;
var emailRegExp = /^([\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4})+$/i

// SCHEMA DEFINITION
var userSchema = new Schema({
	name: { 
		first: 	{ type: String, required: "First Name is Required!" }, 
		last: 	{ type: String, required: "Last Name is Required!" }
	},
	email: 		{ type: String, required: "Email is Required!", lowercase: true, match: emailRegExp },
	password: 	{ type: String, required: "Password is Required!" },
	salt: 		{ type: String, required: "Salt is Required!" },
	title: 		{ type: String, default: "Hacker" },
	created_at:	{ type: Date },
	updated_at:	{ type: Date, 	default: new Date }
});

// VALIDATION
userSchema.path("password").validate(function(val, respond){
	validator.minLength(val, 6, respond);
}, "{PATH} must be more than 6 characters");

// PRE SAVING HOOK
// PASSWORD HASHING - Set salt, Hash Password if it has been updated.
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

// PRE SAVING HOOK
// SET CREATED AT ON FIRST SAVE
userSchema.pre("save", function(next){
	if(!this.created_at) this.created_at = new Date;
	next();
});

// STATICS
// FINDER - Return user by email
userSchema.static("findUserByEmail", function(email, cb){
	return this.findOne({email: email}, cb);
});

// STATICS
// Authenticate user with email/password
userSchema.static("authenticate", function(email, pass, cb){
	this.findUserByEmail(email, function(err, user){
		if(err) return cb(err);
		bcrypt.hash(pass, user.password, function(err, hash){
			if(err) return cb(err);
			if(hash == user.password) return cb(null, user);
			cb();
		});
	});
});

// EXPORT
module.exports = mongoose.model("User", userSchema);
