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
	this.model("Workspace").count({ owner: val }, function(err, count){
		if(err) respond(false);
		count >= LIMIT ? respond(false) : respond(true);
	});
}, "You cannot have more than " + LIMIT + " workspaces");

// VALIDATION - Make sure name of workspace belonging to user is unique
workspaceSchema.path("name").validate(function(name, respond){
	var self = this;
	this.model("Workspace").count({ name: name, owner: self.owner},
		function(err, count){
			if(err) respond(false);
			count > 0 ? respond(false) : respond(true)
		}
	);
});

module.exports = mongoose.model("Workspace", workspaceSchema);