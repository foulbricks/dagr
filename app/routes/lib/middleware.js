exports.populate = function(req, res, next, id, klass, className){
	klass.findById(id, function(err, obj){
		if(err){
			console.log("HH")
			next(err);
		}
		else if(obj){
			req[className.toLowerCase()] = obj;
			next();
		}
		else {
			console.log("TT")
			next(new Error(className + " not found"));
		}
	});
}