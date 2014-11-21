angular.module("Dagr.sessions.services", []).

value("LOGIN_ENDPOINT", "/api/login").

factory("authService", [
	"$http", "$window", "LOGIN_ENDPOINT",
	function($http, $window, LOGIN_ENDPOINT){
		var auth = {};
		
		auth.login = function(email, password){
			return $http.
					post(LOGIN_ENDPOINT, 
						{ credentials: { email: email, password: password }}).
					success(function(data, status){
						auth.token = data.token;
						$window.sessionStorage.token = auth.token;
						return data.token;
					}).
					error(function(data, status){
						auth.token = undefined;
						delete $window.sessionStorage.token;
					});
		}
		
		auth.logout = function(){
			auth.token = undefined;
			delete $window.sessionStorage.token;
		}
						
		return auth;
	}
]).

factory("authInterceptor", [
	"$rootScope", "$window",
	function($rootScope, $window){
		return {
			request: function(config){
				config.headers = config.headers || {};
				if($window.sessionStorage.token){
					config.headers.Authorization = "Bearer " + $window.sessionStorage.token;
				}
				return config;
			}
		}
	}
]);