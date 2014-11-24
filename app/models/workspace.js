var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var workspaceSchema = new Schema({
	name: { type: String, required: "Name is Required"},
	owner: { type: Schema.Types.ObjectId, required: true },
	minions: [Schema.Types.ObjectId]
})