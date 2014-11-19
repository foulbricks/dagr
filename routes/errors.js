var express = require('express');
var router = express.Router();
module.exports = router;

router.use(function(req, res){
	res.status(400).format({
		html: function(){
			res.render("errors/404");
		},
		json: function(){
			res.send({message: "Resource not found"});
		},
		xml: function(){
			res.write("<error>\n");
			res.write("  <message>Resource not found</message>\n");
			res.write("</error>\n");
		},
		text: function(){
			res.send("Resource not found\n");
		}
	});
});

router.use(function(err, req, res, next){
	console.log(err.stack);
	var msg;
	
	switch(err.type){
		case "database" :
			msg = "Server Unavailable";
			res.statusCode = 503;
			break;
		default:
			msg = "Internal Server Error";
			res.statusCode = 500;
	}
	
	res.format({
		html: function(){
			res.render("errors/5xx", {msg: msg, status: res.statusCode});
		},
		json: function(){
			res.send({ error: msg });
		},
		text: function(){
			res.send(msg + "\n");
		}	
	});
});