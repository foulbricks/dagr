var expressJwt =		require("express-jwt");

module.exports = function(app, dir){
	var config =	require(dir + '/config/config');
	var routes = 	require(dir + '/app/routes/index');
	var users = 	require(dir + '/app/routes/users');
	var errors = 	require(dir + "/app/routes/errors");
	var sessions = 	require(dir + "/app/routes/sessions");
	var workspaces = require(dir + "/app/routes/workspaces");
	var clients = require(dir + "/app/routes/clients");
	var projects = require(dir + "/app/routes/projects");
	var tasks = require(dir + "/app/routes/tasks");
	var timeEntries = require(dir + "/app/routes/time_entries");
	
	app.use('/api', expressJwt({secret: config.jwtSecret}).unless({ path: ["/api/signup", "/api/login"] }));
	app.use("/api", sessions);
	app.use("/api", users);
	app.use("/api", workspaces);
	app.use("/api", clients);
	app.use("/api", projects);
	app.use("/api", tasks);
	app.use("/api", timeEntries);
	
	app.get("*", function(req, res){
		res.sendfile(dir + '/public/dist/views/index.html');
	});
	
	app.use(errors);
}