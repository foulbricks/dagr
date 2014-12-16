angular.module("Dagr.clients.services", []).

value("CLIENT_LIST_PATH", "/api/workspaces/:workspace/clients").
value("CLIENT_PATH", "/api/workspaces/:workspace/client/:id").
value("CLIENT_NEW_PATH", "/api/workspaces/:workspace/client").

factory("clientService", [
	"$http", "CLIENT_LIST_PATH", "CLIENT_PATH", "CLIENT_NEW_PATH",
	function($http, CLIENT_LIST_PATH, CLIENT_PATH, CLIENT_NEW_PATH){
		var client = {}
		
		client.list = function(workspace_id){
			workspace_id = workspace_id || "";
			return $http.get(CLIENT_LIST_PATH.replace(":workspace", workspace_id));
		}
		
		client.one = function(workspace_id, id){
			workspace_id = workspace_id || "";
			id = id || "";
			return $http.get(CLIENT_PATH.replace(":workspace", workspace_id).replace(":id", id));
		}
		
		client.new = function(workspace_id, data){
			workspace_id = workspace_id || "";
			return $http.post(CLIENT_NEW_PATH.replace(":workspace", workspace_id), data);
		}
		
		client.update = function(workspace_id, id, data){
			workspace_id = workspace_id || "";
			id = id || "";
			return $http.put(CLIENT_PATH.replace(":workspace", workspace_id).replace(":id", id), data);
		}
		
		client.delete = function(workspace_id, id){
			workspace_id = workspace_id || "";
			id = id || "";
			return $http.delete(CLIENT_PATH.replace(":workspace", workspace_id).replace(":id", id));
		}
		
		return client;
	}
]);