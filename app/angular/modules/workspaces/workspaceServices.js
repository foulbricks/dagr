angular.module("Dagr.workspaces.services", []).

value("WORKSPACES_ENDPOINT", "/api/users/workspaces").
value("NEW_WORKSPACE_ENDPOINT", "/api/users/workspaces").
value("WORKSPACE_PEOPLE", "api/workspaces/users/:id").

factory("workspaceService", [
	"$http", "authService", "WORKSPACES_ENDPOINT", "NEW_WORKSPACE_ENDPOINT",
	"WORKSPACE_PEOPLE",
	function($http, authService, WORKSPACES_ENDPOINT, NEW_WORKSPACE_ENDPOINT, WORKSPACE_PEOPLE){
		var workspace = {}
		
		workspace.list = function(){
			return $http.get(WORKSPACES_ENDPOINT);
		}
		
		workspace.new = function(data){
			return $http.post(NEW_WORKSPACE_ENDPOINT, data);
		}
		
		workspace.people = function(id){
			return $http.get(WORKSPACE_PEOPLE.replace(":id", id));
		}
		
		return workspace;
	}
]);