angular.module("Dagr.admin.services", []).

factory("authService", [
	"$http",
	function($http){
		var auth = {};
		
		return auth;
	}
]);