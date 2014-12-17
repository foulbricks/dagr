var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = require("./user");
var Workspace = require("./workspace");

var taskSchema = new Schema({
	description: {type: String, required: "Name is required" },
	workspace: { type: Schema.Types.ObjectId, ref: "Workspace" },
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

module.exports = mongoose.model("Task", taskSchema);