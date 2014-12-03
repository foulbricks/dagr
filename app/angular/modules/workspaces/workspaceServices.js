angular.module("Dagr.workspaces.services", []).

value("WORKSPACES_ENDPOINT", "/api/users/workspaces").
value("NEW_WORKSPACE_ENDPOINT", "/api/users/workspaces").

factory("workspaceService", [
	"$http", "authService", "WORKSPACES_ENDPOINT", "NEW_WORKSPACE_ENDPOINT",
	function($http, authService, WORKSPACES_ENDPOINT, NEW_WORKSPACE_ENDPOINT){
		var workspace = {}
		
		workspace.list = function(){
			return 
			$http.get(WORKSPACES_ENDPOINT).
			success(function(data){
				return data.workspaces;
			}).
			error(function(err){
				return [];
			});
		}
		
		workspace.new = function(data){
			return $http.post(NEW_WORKSPACE_ENDPOINT.replace(":user", authService.user.id), data);
		}
		
		return workspace;
	}
]);