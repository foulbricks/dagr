var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Project = require("./project");

var clientSchema = new Schema({
	name: { type: String, required: "Name is required" },
	projects: [{ type: Schema.Types.ObjectId, ref: "Project" }]
});

clientSchema.method("toJSON", function(){
	var client = this;
	return {
		id: client.id,
		name: client.name,
		projects: client.projects
	}
});

module.exports = mongoose.model("Client", clientSchema);