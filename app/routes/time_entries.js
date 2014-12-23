var express = require("express");
var router = express.Router();
var Workspace = require("../models/workspace");
var Entry = require("../models/time_entry");
var middleware = require("./lib/middleware");

router.param("workspace", middleware.populate(req, res, next, id, Workspace, "Workspace"));
router.param("id", middleware.populate(req, res, next, id, Entry, "Entry"));

router.get("workspaces/:workspace/time_entries/:year/:month", function(req, res, next){
	var workspace = req.workspace,
		user = req.user,
		start = new Date(req.params.year, req.params.month, 1),
		end = new Date(req.params.year, req.params.month + 1, 0); 
	
	var q = Entry.find({
		workspace: workspace.id, 
		owner: user.id, 
		date: { $gte: start, $lte: end }
	});
	
	q.exec(function(err, entries){
		if(err) return next(err);
		if(!entries) return res.json({ timeEntries: [] });
		
		res.json({ timeEntries: entries });
	});
});

router.get("workspaces/:workspace/time_entry/:id", function(req, res, next){
	var workspace = req.workspace;
	var user = req.user;
	
	Entry.findOne({workpace: workspace.id, owner: user.id}, function(err, entry){
		if(err) return next(err);
		res.json({entry: entry});
	});
});

router.post("workspaces/:workspace/time_entry", function(req, res, next){
	var workspace = req.workspace;
	var user = req.user;
	var data = req.body.timeEntry;
	
	var entry = new Entry({
		workspace: 	workspace.id,
		client: 	data.client,
		owner: 		req.user.id,
		project: 	data.project,
		task: 		data.task,
		start: 		data.start,
		end: 		data.end,
		hours: 		data.hours,
		date: 		data.date
	});
	
	entry.save(function(err, entry){
		if(err) return next(err);
		res.json({status: true });
	});
	
})

router.put("workspaces/:workspace/time_entry/:id", function(req, res, next){
	var entry = req.entry;
	var data = req.body.timeEntry;
	
	entry.client 	= data.client 	|| entry.client;
	entry.project 	= data.project 	|| entry.project;
	entry.task 		= data.task 	|| entry.task;
	entry.start		= data.start 	|| entry.start;
	entry.end 		= data.end 		|| entry.end;
	entry.hours 	= data.hours 	|| entry.hours;
	entry.date 		= data.date 	|| entry.date;
	
	entry.save(function(err, entry){
		if(err) return next(err);
		res.json({status: true});
	});
});

router.delete("workspaces/:workspace/time_entry/:id", function(req, res, next){
	var entry = req.entry;
	
	entry.remove(function(err){
		if(err) return next(err);
		res.json({status: true});
	});
});

module.exports = router;