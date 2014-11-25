angular.module("Dagr.users.services", []).

value("SIGNUP_ENDPOINT", "/api/signup").

factory("userService", [
	"$http", "SIGNUP_ENDPOINT",
	function($http, SIGNUP_ENDPOINT){
		var user = {};
		
		user.signup = function(user){
			return $http.post(SIGNUP_ENDPOINT, user);
		}
		
		return user;
	}
])