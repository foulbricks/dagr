var Factory = require("factory-lady");
var User = require("../../app/models/user");

Factory.define("user", User, {
	name: { first: "John", last: "Testington" },
	email: "test@example.com",
	password: "password",
	salt: "thesalt"
});

module.exports = Factory;