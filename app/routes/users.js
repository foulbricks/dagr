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
		if(err){
			res.status(500).json({ status: false, errors: err });
		}
		else {
			res.json({ status: true, errors: null });
		}
	});
});

module.exports = router;
