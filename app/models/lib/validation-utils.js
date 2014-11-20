exports.minLength = function(val, length, respond){
	if(val && val.length < length){
		respond(false);
	}
	respond();
}