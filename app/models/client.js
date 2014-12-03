var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Project = require("./project");

var clientSchema = new Schema({
	name: { type: String, required: "Name is required" },
	projects: [{ type: Schema.Types.ObjectId, ref: "Project" }];
});

module.exports = clientSchema.model("Client", clientSchema);