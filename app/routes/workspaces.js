var express = require("express");
var router = express.Router();
var Workspace = require("../models/workspace");
var User = require("../models/user");

router.param("user", function(req, res, next, id){
	User.findOne({_id: id }, function(err, user){
		if(err) return next(err);
		if(!user) return next(new Error("User not found"));
		req.user = user;
		next();
	})
});

router.get("/users/:user/workspaces", function(req, res, next){
	Workspace.find({$or: [{owner: req.user.id}, {minions: req.user.id } ]}, 
		function(err, workspaces){
			if(err) next(err);
			if(!workspaces) res.json({workspaces: []});
			res.json({workspaces: workspaces});
		}
	);
});

router.post("/users/:user/workspaces", function(req, res){
	var data = req.body.workspace;
	var workspace = new Workspace({
		name: data.name,
		owner: req.user.id
	});
	
	workspace.save(function(err, saved){
		if(!err){
			res.json({ status: true, errors: null });
		}
		else {
			var e = [];
			for(var prop in err.errors){
				e.push(err.errors[prop].message);
			}
			res.status(400).json({ status: false, errors: e });
		}
	});
});

router.post("/users/:user/workspaces/invite/:id", function(req, res){
	
});

router.post("/users/:user/workspaces/join/:id", function(req, res){
	
});

router.get("/users/:user/workspaces/:id", function(req, res){
	
});

router.put("/users/:user/workspaces/:id", function(req, res){
	
});

router.delete("/users/:user/workspaces/:id", function(req, res){
	
});

router.get("/workspaces/users/suggest/:id", function(req, res){
	
});

router.get("/workspaces/users/:id", function(req, res){
	
});

module.exports = router;