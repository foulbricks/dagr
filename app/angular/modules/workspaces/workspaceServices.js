angular.module("Dagr.workspaces.services", []).

value("WORKSPACES_ENDPOINT", "/api/users/:user/workspaces").
value("NEW_WORKSPACE_ENDPOINT", "/api/users/:user/workspaces").

factory("workspaceService", [
	"$http", "authService", "WORKSPACES_ENDPOINT", "NEW_WORKSPACE_ENDPOINT",
	function($http, authService, WORKSPACES_ENDPOINT, NEW_WORKSPACE_ENDPOINT){
		var workspace = {}
		
		workspace.list = function(){
			return $http.get(WORKSPACES_ENDPOINT.replace(":user", authService.user.id));
		}
		
		workspace.new = function(data){
			return $http.post(NEW_WORKSPACE_ENDPOINT.replace(":user", authService.user.id), data);
		}
		
		return workspace;
	}
]);