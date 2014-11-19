angular.module("Dagr.sessions.services", []).

factory("authService", [
	"$http",
	function($http){
		var auth = {};
		
		return auth;
	}
]);