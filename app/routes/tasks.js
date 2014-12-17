var express = require("express");
var router = express.Router();
var Workspace = require("../models/workspace");
var Project = require("../models/project");
var Client = require("../models/client");
var utils = require("./lib/utils");

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

router.param("project", function(req, res, next, id){
	Project.findById(id, function(err, project){
		if(err){
			next(err);
		}
		else if(project){
			req.project = project;
			next();
		}
		else {
			next(new Error("Project not found"));
		}
	});
});

router.param("id", function(req, res, next, id){
	Task.findById(id, function(err, task){
		if(err){
			next(err);
		}
		else if(client){
			req.task = task;
			next();
		}
		else {
			next(new Error("Task not found"));
		}
	});
});

// List tasks on workspace
router.get("/workspaces/:workspace/tasks", function(req, res, next){
	var workspace = req.workspace;
	
	Client.find({_id: {$in: workspace.clients} }, 
		function(err, clients){
			if(err) return next(err);
			if(!clients) return res.json({clients: []});
			clients.forEach(function(client){
				Task.find({client: client.id}, function(err, tasks){
					if(err) return next(err);
					if(!tasks) client.tasks = [];
					client.tasks = tasks;
				});
			});
			
			
			res.json({projects: projects});
		}
	);
});

module.exports = router;