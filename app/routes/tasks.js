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

// List one task
router.get("/projects/tasks/:id", function(req, res, next){
	res.json({ task: req.task });
});

// Process new task
router.post("/projects/:project/task", function(req, res, next){
	var project = req.project;
	var data = req.body.task;
	
	var task = new Task({
		description: data.description,
		owner: req.user.id,
		status: "Active",
		due_date: data.due_date
	});
	
	Client.find({projects: project.id}, function(err, client){
		if(err) return next(err);
		if(!client) return res.status(400).json({error: "Client not found"});
		
		task.client = client;
		task.workspace = project.workspace;
		task.save(function(err, dbTask){
			if(err) res.status(400).json({ status: false, error: utils.errorList(err) });
			project.tasks.push(dbTask);
			
			project.save(function(err, w){
				if(err) res.status(400).json({ status: false, error: utils.errorList(err) });
				res.json({ status: true, errors: null });
			});
		});
	});
});


module.exports = router;