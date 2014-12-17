var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Task = require("./task");
var User = require("./user");
var Workspace = require("./workspace");

var projectSchema = new Schema({
	name: {type: String, required: "Name is required" },
	description: {type: String},
	tasks: [{type: Schema.Types.ObjectId, ref: "Task" }],
	owner: {type: Schema.Types.ObjectId, ref: "User" },
	workspace: { type: Schema.Types.ObjectId, ref: "Workspace" }
});

projectSchema.method("toJSON", function(){
	var project = this;
	return {
		id: project.id,
		name: project.name,
		description: project.description,
		tasks: project.tasks
	}
});

module.exports = mongoose.model("Project", projectSchema);