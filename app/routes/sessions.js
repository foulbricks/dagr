var express = require('express');
var jwt = require('jsonwebtoken');
var User = require("../models/user");
var router = express.Router();


router.post('/login', function(req, res) {
	var data = req.body.credentials;
	User.authenticate(data.email, data.password, function(err, user){
		if(err) return next(err);
		if(user){
			var token = jwt.sign(user, "secret", { expiresInMinutes: 60 * 3 } );
			res.json({ token: token, user: user });
		}
		else {
			res.status(401).json({ error: "Invalid credentials", token: null })
		}
	});
});

module.exports = router;