angular.module("Dagr.tasks.services", []).

value("TASK_LIST_PATH", "/api/workspaces/:workspace/tasks").
value("TASK_PATH", "/api/projects/tasks/:id").
value("TASK_NEW_PATH", "/api/projects/:project/task").

factory("taskService", [
	"$http", "TASK_LIST_PATH", "TASK_PATH", "TASK_NEW_PATH",
	function($http, TASK_LIST_PATH, TASK_PATH, TASK_NEW_PATH){
		var task = {}
		
		task.workspaceList = function(workspace_id){
			workspace_id = workspace_id || "";
			return $http.get(TASK_LIST_PATH.replace(":workspace", workspace_id));
		}
		
		task.one = function(id){
			id = id || "";
			return $http.get(TASK_PATH.replace(":id", id));
		}
		
		task.new = function(project_id, data){
			project_id = project_id || "";
			return $http.post(TASK_NEW_PATH.replace(":project", project_id), data);
		}
		
		// client.update = function(workspace_id, id, data){
		// 	workspace_id = workspace_id || "";
		// 	id = id || "";
		// 	return $http.put(CLIENT_PATH.replace(":workspace", workspace_id).replace(":id", id), data);
		// }
		// 
		// client.delete = function(workspace_id, id){
		// 	workspace_id = workspace_id || "";
		// 	id = id || "";
		// 	return $http.delete(CLIENT_PATH.replace(":workspace", workspace_id).replace(":id", id));
		// }
		
		return task;
	}
]);