var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = require("./user");
var Workspace = require("./workspace");
var Client = require("./client");
var Project = require("./project");

var taskSchema = new Schema({
	description: {type: String, required: "Name is required" },
	workspace: { type: Schema.Types.ObjectId, ref: "Workspace" },
	client: { type: Schema.Types.ObjectId, ref: "Client" },
	owner: {type: Schema.Types.ObjectId, ref: "User" },
	status: { type: String },
	due_date: { type: Date },
	created_at:	{ type: Date },
	updated_at:	{ type: Date, 	default: new Date }
});

taskSchema.pre("save", function(next){
	if(!this.created_at) this.created_at = new Date;
	next();
});

taskSchema.method("toJSON", function(){
	var task = this;
	Project.find({tasks: task.id}, function(err, project){
		if(err || !project) return {};
		return {
			id: task.id,
			description: task.description,
			status: task.status,
			due_date: task.due_date,
			updated_at: task.updated_at,
			created_at: task.created_at,
			project: project.toJSON()
		}
	});
});

module.exports = mongoose.model("Task", taskSchema);