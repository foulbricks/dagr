exports.errorList = function(err){
	var e = [];
	for(var prop in err.errors){
		e.push(err.errors[prop].message);
	}
	return e;
}