var express = require("express");
var router = express.Router();
var utils = require("./lib/utils");
var Workspace = require("../models/workspace");
var User = require("../models/user");

router.param("id", function(req, res, next, id){
	Workspace.findById(id, function(err, workspace){
		if(err){
			next(err);
		}
		else if(workspace){
			req.workspace = workspace;
		}
		else {
			//res.status(400).json({ error: "Workspace not found" });
			next(new Error("Workspace not found"));
		}
	});
});

// List workspaces
router.get("/users/workspaces", function(req, res, next){
	Workspace.find({$or: [{owner: req.user.id}, {minions: req.user.id } ]}, 
		function(err, workspaces){
			if(err) return next(err);
			if(!workspaces) return res.json({workspaces: []});
			res.json({workspaces: workspaces});
		}
	);
});

// Process new workspace
router.post("/users/workspaces", function(req, res){
	var data = req.body.workspace;
	var workspace = new Workspace({
		name: data.name,
		owner: req.user.id,
		minions: data.minions || []
	});
	
	workspace.save(function(err, saved){
		if(!err){
			res.json({ status: true, errors: null });
		}
		else {
			res.status(400).json({ status: false, error: utils.errorList(err) });
		}
	});
});

// List one workspace
router.get("/users/workspaces/:id", function(req, res, next){
	res.json({ workspace: req.workspace });
});

// Update workspace
router.put("/users/workspaces/:id", function(req, res){
	var data = req.body.workspace;
	var workspace = req.workspace;
	
	workspace.name = data.name || workspace.name;
	workspace.minions = data.minions || workspace.minions;
	
	workspace.save(function(err, saved){
		if(!err){
			res.json({ status: true, errors: null });
		}
		else {
			res.status(400).json({ status: false, error: utils.errorList(err) });
		}
	});
});

// Delete workspace
router.delete("/users/workspaces/:id", function(req, res){
	var workspace = req.workspace;
	
	workspace.remove(function(err){
		if(err) return next(err);
		res.json({ status: true });
	});
});

// Suggest users who might be interested in this workspace
router.get("/workspaces/users/suggest/:id", function(req, res){
	var workspace = req.workspace;
	var emailDomain = req.user.email.split("@").reverse()[0];
	if(emailDomain){
		User.find({email: new RegExp(emailDomain, "i")}, function(err, users){
			if(err) return next(err);
			if(!users) return res.json({users: [] });
			
			res.json({users: users});
		});
	}
	else {
		res.json({users: []});
	}
});

// List users in this workspace
router.get("/workspaces/users/:id", function(req, res, next){
	var workspace = req.workspace;
	
	User.find({_id: workspace.minions.concat(workspace.owner)}, function(err, users){
		if(err) return next(err);
		if(!users) return res.json({users: [] });
		
		res.json({users: users});
	});
});

// Join workspace after invite
router.post("/users/workspaces/join/:id", function(req, res, next){
	var workspace = req.workspace;
	workspace.minions.push(req.user.id);
	
	workspace.save(function(err){
		if(err) return res.status(400).json({ status: false, error: utils.errorList(err) });
		
		User.findById(req.user.id, function(err, user){
			if(err) return next(err);
			if(!user) return res.status(400).json({ error: "User not found" });
			
			var index = user.workspaceInvites.indexOf(workspace.id);
			if(index) user.workspaceInvites.splice(index, 1);
			
			user.save(function(err){
				if(err) return res.status(400).json({ status: false, error: utils.errorList(err) });
				res.json({status: true});
			});
			
		});
	});
});

// Add an invitation to join a workspace to another user
router.post("/users/:user/workspaces/invite/:id", function(req, res, next){
	var workspace = req.workspace;
	
	if(workspace.owner != req.user.id){
		res.status(400).json({ error: "Cannot process invite. You are not the owner"});
	}
	else {
		User.findById(req.params.id, function(err, user){
			if(err) return next(err);
			if(!user) return res.status(400).json({error: "User not found"});
			
			user.workspaceInvites.push(workspace.id);
			user.save(function(err){
				if(err) return res.status(400).json({ status: false, error: utils.errorList(err) });
				res.json({status: true});
			});
		});
	}
});

module.exports = router;