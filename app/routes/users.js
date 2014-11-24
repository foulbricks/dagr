var express = require('express');
var router = express.Router();
var User = require("../models/user");

router.post('/signup', function(req, res) {
	var data = req.body.user;
	var user = new User({
		name: { first: data.name.first, last: data.name.last },
		email: data.email,
		password: data.password,
		title: data.title,
	})
	
	user.save(function(err, saved){
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

module.exports = router;
