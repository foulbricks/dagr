var express = require("express");
var router = express.Router();
var Workspace = require("../models/workspace");

router.param("workspace", function(req, res, next, id){
	Workspace.findById(id, function(err, workspace){
		if(err){
			next(err);
		}
		else if(workspace){
			req.workspace = workspace;
			next();
		}
		else {
			next(new Error("Workspace not found"));
		}
	});
});

module.exports = router;