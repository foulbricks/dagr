exports.minLength = function(length){
	return function(val, respond){
		if(val && val.length < length){
			respond(false);
		}
		respond();
	}
}