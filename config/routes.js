module.exports = function(app, dir){
	var routes = 	require(dir + '/app/routes/index');
	var users = 	require(dir + '/app/routes/users');
	var errors = 	require(dir + "/app/routes/errors");
	
	//app.use('/', routes);
	app.use('/users', users);
	app.get("*", function(req, res){
		res.sendfile(dir + '/public/angular/views/index.html');
	});
	app.use(errors);
}