var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Task = require("./task");

var projectSchema = new Schema({
	name: {type: String, required: "Name is required" },
	tasks: [{type: Schema.Types.ObjectId, ref: "Task" }]
});

module.exports = mongoose.model("Project", projectSchema);