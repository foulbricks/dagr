exports.populate = function(req, res, next, id, klass, className){
	
	return function(req, res, next, id){
		klass.findById(id, function(err, obj){
			if(err){
				next(err);
			}
			else if(obj){
				req[className.toLowerCase()] = obj;
				next();
			}
			else {
				next(new Error(className + " not found"));
			}
		});
	}
}