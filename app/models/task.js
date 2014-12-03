var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var taskSchema = new Schema({
	name: {type: String, required: "Name is required" }
});

module.exports = mongoose.model("Task", taskSchema);