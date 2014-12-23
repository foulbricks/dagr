var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = require("./user");
var Workspace = require("./workspace");
var Client = require("./client");
var Project = require("./project");
var Task = require("./task");

var entrySchema = new Schema({
	workspace: { type: Schema.Types.ObjectId, ref: "Workspace" },
	client: { type: Schema.Types.ObjectId, ref: "Client" },
	owner: {type: Schema.Types.ObjectId, ref: "User" },
	project: {type: Schema.Types.ObjectId, ref: "Project"},
	task: {type: Schema.Types.ObjectId, ref: "Task"},
	start: {type: Date },
	end: { type: Date  },
	date: { type: Date },
	hours: { type: Number },
	created_at:	{ type: Date },
	updated_at:	{ type: Date, 	default: new Date }
});

entrySchema.pre("save", function(next){
	if(!this.created_at) this.created_at = new Date;
	next();
});

module.exports = mongoose.model("TimeEntry", entrySchema);