var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: { first: String, last: String },
	email: String,
	password: String
});

module.exports = mongoose.model("User", userSchema);
