var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = require("./user");
var config = require("../../config/config");

var LIMIT = config.workspace_limit;

var workspaceSchema = new Schema({
	name: { type: String, required: "Name is Required"},
	owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	minions: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

// VALIDATION - Do not allow more than the limit of workspaces
workspaceSchema.path("owner").validate(function(val, respond){
	this.model("Workspace").find({ owner: val }).
	count().
	exec(function(err, count){
		if(err) respond(false);
		count > LIMIT ? respond(false) : respond();
	});
}, "You cannot have more than " + LIMIT + " workspaces");

// VALIDATION - Make sure name of workspace belonging to user is unique
workspaceSchema.path("name").validate(function(name, respond){
	this.model("Workspace").find({ name: name, owner: this.id}).
	count().
	exec(function(err, count){
		if(err) respond(false);
		count > 0 ? respond(false) : respond()
	});
})

module.exports = mongoose.model("Workspace", workspaceSchema);