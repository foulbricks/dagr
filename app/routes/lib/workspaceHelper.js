exports.processInvites = function processInvites(err, users, workspace, next){
	if(err) return next(err);
	if(users){
		for(var i = 0; i < users.length; i++){
			var inviteIndex = users[i].workspaceInvites.indexOf(workspace.id);
			var minionsIndex = workspace.minions.indexOf(users[i].id);

			// Make sure this workspace is not a duplicate
			if(inviteIndex < 0 && minionsIndex < 0 && workspace.owner.id != users[i].id){
				users[i].workspaceInvites.push(workspace.id);
				users[i].save(function(err){
					if(err) return next(err);
				});
			}
		}
	}
}