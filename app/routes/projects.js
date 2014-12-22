var express = require("express");
var router = express.Router();
var Workspace = require("../models/workspace");
var Client = require("../models/client");
var Project = require("../models/project");
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

router.param("client", function(req, res, next, id){
	Client.findById(id, function(err, client){
		if(err){
			next(err);
		}
		else if(client){
			req.client = client;
			next();
		}
		else {
			next(new Error("Client not found"));
		}
	});
});

router.param("id", function(req, res, next, id){
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

// List projects on workspace
router.get("/workspaces/:workspace/project", function(req, res, next){
	var workspace = req.workspace;
	Project.find({workspace: workspace.id}, 
		function(err, projects){
			if(err) return next(err);
			if(!projects) return res.json({projects: []});
			res.json({projects: projects});
		}
	);
});

//List projects on client
router.get("/clients/:client/project", function(req, res, next){
	var client = req.client;
	Project.find({_id: {$in: client.projects }}, 
		function(err, projects){
			if(err) return next(err);
			if(!projects) return res.json({projects: []});
			res.json({projects: projects});
		}
	);
});

// List one project
router.get("/workspaces/project/:id", function(req, res, next){
	var project = req.project;
	res.json({ project: project });
});

// Process new project
router.post("/clients/:client/project", function(req, res, next){
	var client = req.client;
	var data = req.body.project;
	var project = new Project({
		name: data.name,
		description: data.description,
		tasks: [],
		owner: req.user.id
	});
	
	Workspace.findOne({ clients: client.id }, function(err, workspace){
		if(err) return next(err);
		if(!workspace) return res.status(400).json({ error: "Workspace not found" });
		
		project.workspace = workspace.id;
		
		project.save(function(err, saved){
			if(err) res.status(400).json({ status: false, error: utils.errorList(err) });
			
			client.projects.push(saved.id);
			
			client.save(function(err, c){
				if(err) res.status(400).json({ status: false, error: utils.errorList(err) });
				
				res.json({ status: true, errors: null });
			});
		});
	});
});

module.exports = router;