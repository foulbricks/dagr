module.exports = function(app, dir){
	var routes = 	require(dir + '/routes/index');
	var users = 	require(dir + '/routes/users');
	var errors = 	require(dir + "/routes/errors");
	
	app.use('/', routes);
	app.use('/users', users);
	app.use(errors);
}