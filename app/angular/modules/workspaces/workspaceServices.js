angular.module("Dagr.workspaces.services", []).

value("WS_LIST_PATH", "/api/users/workspaces").
value("NEW_WS_PATH", "/api/users/workspaces").
value("WS_PEOPLE_PATH", "api/workspaces/users/:id").
value("WS_PEEP_SUGGEST_PATH", "api/workspaces/users/suggest/:id").
value("WS_INVITE_PATH", "api/users/workspaces/invite/:id").
value("WS_DELETE_PATH", "api/users/workspaces/:id").
value("WS_JOIN_PATH", "api/users/workspaces/join/:id").
value("WS_DELETE_MEMBER_PATH", "api/users/:user/workspaces/delete/:id").
value("WS_PATH", "api/users/workspaces/:id").
value("WS_DISMISS_PATH", "api/users/worskpaces/dismiss/:id").

factory("workspaceService", [
	"$http", "WS_LIST_PATH", "NEW_WS_PATH", "WS_PEOPLE_PATH", "WS_PEEP_SUGGEST_PATH",
	"WS_INVITE_PATH", "WS_DELETE_PATH", "WS_JOIN_PATH", "WS_DELETE_MEMBER_PATH", "WS_PATH",
	"WS_DISMISS_PATH",
	function($http, WS_LIST_PATH, NEW_WS_PATH, WS_PEOPLE_PATH, WS_PEEP_SUGGEST_PATH,
		WS_INVITE_PATH, WS_DELETE_PATH, WS_JOIN_PATH, WS_DELETE_MEMBER_PATH, WS_PATH,
		WS_DISMISS_PATH){
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
			var id = id || "";
			return $http.get(WS_PEEP_SUGGEST_PATH.replace(":id", id));
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
			return $http.put(WS_JOIN_PATH.replace(":id", id));
		}
		
		workspace.dismiss = function(id){
			var id = id || "";
			return $http.put(WS_DISMISS_PATH.replace(":id", id));
		}
		
		workspace.deleteMember = function(id, user){
			var id = id || "";
			var user = user || "";
			return $http.put(WS_DELETE_MEMBER_PATH.replace(":id", id).replace(":user", user))
		}
		
		workspace.show = function(id){
			var id = id || "";
			return $http.get(WS_PATH.replace(":id", id));
		}
		
		return workspace;
	}
]);