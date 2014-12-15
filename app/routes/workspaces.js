var express = require("express");
var router = express.Router();
var utils = require("./lib/utils");
var helper = require("./lib/workspaceHelper");
var Workspace = require("../models/workspace");
var User = require("../models/user");

router.param("id", function(req, res, next, id){
	Workspace.findById(id, function(err, workspace){
		if(err){
			next(err);
		}
		else if(workspace){
			req.workspace = workspace;
			next();
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
router.post("/users/workspaces", function(req, res, next){
	var data = req.body.workspace;
	var workspace = new Workspace({
		name: data.name,
		owner: req.user.id,
		minions: []
	});
	
	workspace.save(function(err, saved){
		if(!err){
			// Set invitations for users
			if(data.users){
				User.find({_id: data.users}, function(err, users){
					helper.processInvites(err, users, saved, next)
				});
			}
			if(data.emails){
				emails = data.emails.split(/\s?,\s?/);
				User.find({email: emails}, function(err, users){
					helper.processInvites(err, users, saved, next)
				});
				// TODO: SEND EMAIL TO JOIN SITE IF EMAIL NOT FOUND
			}
			res.json({ status: true, errors: null });
		}
		else {
			res.status(400).json({ status: false, error: utils.errorList(err) });
		}
	});
});

// List one workspace
router.get("/users/workspaces/:id", function(req, res, next){
	if(Workspace.userIsMember(req.workspace, req.user.id) || req.user.invites.indexOf(req.workspace.id) > -1){
		res.json({ workspace: req.workspace });
	}
});

// Update workspace
router.put("/users/workspaces/:id", function(req, res){
	var data = req.body.workspace;
	var workspace = req.workspace;
	
	if(workspace.owner == req.user.id){
		workspace.name = data.name || workspace.name;
	
		workspace.save(function(err, saved){
			if(!err){
				res.json({ status: true, errors: null });
			}
			else {
				res.status(400).json({ status: false, error: utils.errorList(err) });
			}
		});
	}
	else {
		res.status(400).json({error: "You need to be the owner"});
	}
});

// Delete workspace
router.delete("/users/workspaces/:id", function(req, res, next){
	var workspace = req.workspace;
	
	if(workspace.owner == req.user.id){
		workspace.remove(function(err){
			if(err) return next(err);
			res.json({ status: true });
		});
	}
	else {
		res.status(400).json({error: "You need to be the owner"});
	}
});

// Suggest users who might be interested in this workspace
router.get("/workspaces/users/suggest/:id?", function(req, res, next){
	var exclude = [req.user.id];
	var workspace = req.workspace;
	
	if(workspace){ // Don't suggest owner or their minions
		exclude.push(workspace.owner);
		workspace.minions.forEach(function(minion){
			exclude.push(minion);
		});
	}
	
	var emailDomain = req.user.email.split("@").reverse()[0];
	if(emailDomain){
		User.find({email: new RegExp(emailDomain, "i"), _id: {$nin: exclude} }, function(err, users){
			if(err) return next(err);
			if(!users) return res.json({users: [] });
			
			console.log(exclude)
			if(workspace){ // Remove pending invites from list
				var usersCopy = users.slice(0);
				usersCopy.forEach(function(user, index){
					if(user.workspaceInvites.indexOf(workspace.id) > -1){
						users.splice(index, 1);
					}
				});
			}
			
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
	if(Workspace.userIsMember(workspace, req.user.id)){
		User.find({_id: workspace.minions.concat(workspace.owner)}, function(err, users){
			if(err) return next(err);
			if(!users) return res.json({users: [] });
		
			res.json({users: users});
		});
	}
});

// Join workspace after invite
router.post("/users/workspaces/join/:id", function(req, res, next){
	User.findById(req.user.id, function(err, user){
		if(err) return next(err);
		if(!user) return res.status(400).json({ error: "User not found" });
		
		var workspace = req.workspace;
		var index = user.workspaceInvites.indexOf(workspace.id);
		
		if(index > -1){
			workspace.minions.push(req.user.id);
	
			workspace.save(function(err){
				if(err) return res.status(400).json({ status: false, error: utils.errorList(err) });
			
				user.workspaceInvites.splice(index, 1);
			
				user.save(function(err){
					if(err) return res.status(400).json({ status: false, error: utils.errorList(err) });
					res.json({status: true});
				});
			});
		}
		else {
			res.status(400).json({error: "Can't join without being invited!"});
		}
	});
});

// Add an invitation to join after workspace is created
router.post("/users/workspaces/invite/:id", function(req, res, next){
	var workspace = req.workspace;
	
	if(Workspace.userIsMember(workspace, req.user.id)) {
		var data = req.body.workspace;
		if(data.users){
			User.find({_id: data.users}, function(err, users){
				helper.processInvites(err, users, workspace, next);
			});
		}
		if(data.emails){
			emails = data.emails.split(/\s?,\s?/);
			User.find({email: emails}, function(err, users){
				helper.processInvites(err, users, workspace, next);
			});
			// TODO: SEND EMAIL TO JOIN SITE IF EMAIL NOT FOUND
		}
		res.json({status: true});
	}
});

router.put("/users/:user/workspaces/delete/:id", function(req, res, next){
	var workspace = req.workspace;
	
	if(workspace.owner == req.user.id){
		User.findById(req.params.user, function(err, user){
			if(err) return next(err);
			if(user){
				var index = workspace.minions.indexOf(user.id);
				if(index > -1){
					workspace.minions.slice(index, 1);
					workspace.save(function(err){
						if(err) return next(err);
						res.json({ status: true });
					});
				}
			}
			else {
				res.json({ status: true });
			}
		});
	}
	else {
		res.status(400).json({error: "You need to be the owner"});
	}
});

module.exports = router;