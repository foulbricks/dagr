angular.module("Dagr.workspaces.services", []).

value("WS_LIST_PATH", "/api/users/workspaces").
value("NEW_WS_PATH", "/api/users/workspaces").
value("WS_PEOPLE_PATH", "api/workspaces/users/:id").
value("WS_PEEP_SUGGEST_PATH", "api/workspaces/users/suggest").
value("WS_INVITE_PATH", "api/users/workspaces/invite/:id").
value("WS_DELETE_PATH", "api/users/workspaces/:id").
value("WS_JOIN_PATH", "api/users/workspaces/join/:id").
value("WS_DELETE_MEMBER_PATH", "api/users/:user/workspaces/delete/:id").

factory("workspaceService", [
	"$http", "authService", "WS_LIST_PATH", "NEW_WS_PATH", "WS_PEOPLE_PATH", "WS_PEEP_SUGGEST_PATH",
	"WS_INVITE_PATH", "WS_DELETE_PATH", "WS_JOIN_PATH", "WS_DELETE_MEMBER_PATH",
	function($http, authService, WS_LIST_PATH, NEW_WS_PATH, WS_PEOPLE_PATH, WS_PEEP_SUGGEST_PATH,
		WS_INVITE_PATH, WS_DELETE_PATH, WS_JOIN_PATH, WS_DELETE_MEMBER_PATH){
		var workspace = {}
		
		workspace.self = {};
		
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
		
		workspace.invite = function(data, id){
			var id = id || "";
			return $http.post(WS_INVITE_PATH.replace(":id", id), data);
		}
		
		workspace.delete = function(id){
			var id = id || "";
			return $http.delete(WS_DELETE_PATH.replace(":id", id));
		}
		
		workspace.join = function(id){
			var id = id || "";
			return $http.get(WS_JOIN_PATH.replace(":id", id));
		}
		
		workspace.deleteMember = function(id, user){
			var id = id || "";
			var user = user || "";
			return $http.put(WS_DELETE_MEMBER_PATH.replace(":id", id).replace(":user", user))
		} 
		
		return workspace;
	}
]);