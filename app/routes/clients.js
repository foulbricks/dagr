var express = require("express");
var router = express.Router();
var Workspace = require("../models/workspace");
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

router.param("id", function(req, res, next, id){
	Client.findById(id, function(err, client){
		if(err){
			next(err);
		}
		else if(workspace){
			req.client = client;
			next();
		}
		else {
			next(new Error("Workspace not found"));
		}
	});
});

// List clients
router.get("/workspaces/:workspace/clients", function(req, res, next){
	var workspace = req.workspace;
	Client.find({_id: {$in: workspace.clients }}, 
		function(err, clients){
			if(err) return next(err);
			if(!clients) return res.json({clients: []});
			res.json({clients: workspaces});
		}
	);
});

// List one client
router.get("/workspaces/:workspace/client/:id", function(req, res, next){
	var workspace = req.workspace;
	var client = req.client;
	if(workspace.clients.indexOf(client.id) > -1){
		res.json({ client: client });
	}
});

// Process new client
router.post("/workspaces/:workspace/client", function(req, res, next){
	var workspace = req.workspace
	var data = req.body.client;
	var client = new Client({
		name: data.name,
		projects: []
	});
	
	client.save(function(err, saved){
		if(!err){
			workspace.clients.push(saved);
			workspace.save(function(err, w){
				if(err) res.status(400).json({ status: false, error: utils.errorList(err) });
				res.json({ status: true, errors: null });
			});
		}
		else {
			res.status(400).json({ status: false, error: utils.errorList(err) });
		}
	});
});

// Update client
router.put("/workspaces/:workspace/client/:id", function(req, res, next){
	var data = req.body.client;
	var workspace = req.workspace;
	var client = req.client;
	
	if(workspace.clients.indexOf(client.id) > -1){
		client.name = data.name || client.name;
	
		client.save(function(err, saved){
			if(!err){
				res.json({ status: true, errors: null });
			}
			else {
				res.status(400).json({ status: false, error: utils.errorList(err) });
			}
		});
	}
	else {
		res.status(400).json({error: "Client not found"});
	}
});

// Delete client
router.delete("/workspaces/:workspace/client/:id", function(req, res, next){
	var workspace = req.workspace;
	var client = req.client;
	var index = workspace.clients.indexOf(client.id);
	
	if(index > -1){
		client.remove(function(err){
			if(err) return next(err);
			workspace.clients.splice(index, 1);
			workspace.save(function(err, w){
				if(err) return next(err);
				res.json({ status: true });
			});
		});
	}
	else {
		res.status(400).json({error: "Client not found"});
	}
});

module.exports = router;