angular.module("Dagr.workspaces.services", []).

value("WS_LIST_PATH", "/api/users/workspaces").
value("NEW_WS_PATH", "/api/users/workspaces").
value("WS_PEOPLE_PATH", "api/workspaces/users/:id").
value("WS_PEEP_SUGGEST_PATH", "api/workspaces/users/suggest").

factory("workspaceService", [
	"$http", "authService", "WS_LIST_PATH", "NEW_WS_PATH", "WS_PEOPLE_PATH", "WS_PEEP_SUGGEST_PATH",
	function($http, authService, WS_LIST_PATH, NEW_WS_PATH, WS_PEOPLE_PATH, WS_PEEP_SUGGEST_PATH){
		var workspace = {}
		
		workspace.list = function(){
			return $http.get(WS_LIST_PATH);
		}
		
		workspace.new = function(data){
			return $http.post(NEW_WS_PATH, data);
		}
		
		workspace.people = function(id){
			var id = id || "";
			return $http.get(WS_PEOPLE_PATH.replace(":id", id));
		}
		
		workspace.suggestions = function(id){
			return $http.get(WS_PEEP_SUGGEST_PATH);
		}
		
		return workspace;
	}
]);