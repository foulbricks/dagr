var expressJwt =		require("express-jwt");

module.exports = function(app, dir){
	var routes = 	require(dir + '/app/routes/index');
	var users = 	require(dir + '/app/routes/users');
	var errors = 	require(dir + "/app/routes/errors");
	var sessions = 	require(dir + "/app/routes/sessions");
	
	app.use('/api', expressJwt({secret: "secret"}).unless({ path: ["/api/signup", "/api/login"] }));
	app.use("/api", sessions);
	app.use("/api", users);
	
	app.get("*", function(req, res){
		res.sendfile(dir + '/public/angular/views/index.html');
	});
	
	app.use(errors);
}