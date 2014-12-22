angular.module("Dagr.projects.services", []).

value("PROJECT_LIST_PATH", "/api/workspaces/:workspace/project").
value("PROJECT_LIST_BY_CLIENT_PATH", "/api/clients/:client/project").
value("PROJECT_PATH", "/api/workspaces/project/:id").
value("PROJECT_NEW_PATH", "/api/clients/:client/project").

factory("projectService", [
	"$http", "PROJECT_LIST_PATH", "PROJECT_PATH", "PROJECT_NEW_PATH", "PROJECT_LIST_BY_CLIENT_PATH",
	function($http, PROJECT_LIST_PATH, PROJECT_PATH, PROJECT_NEW_PATH, CLIENT_PATH){
		var project = {};
		
		project.list = function(workspace_id){
			workspace_id = workspace_id || "";
			return $http.get(PROJECT_LIST_PATH.replace(":workspace", workspace_id));
		}
		
		project.listByClient = function(client_id){
			client_id = client_id || "";
			return $http.get(CLIENT_PATH.replace(":client", client_id));
		}
		
		project.new = function(client_id, data){
			client_id = client_id || "";
			return $http.post(PROJECT_NEW_PATH.replace(":client", client_id), data);
		}
		
		return project;
	}
]);