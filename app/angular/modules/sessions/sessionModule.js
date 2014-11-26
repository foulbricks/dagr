angular.module("Dagr.sessions", [
	"Dagr.sessions.controllers",
	"Dagr.sessions.services"
]).

config([
	"$stateProvider", "$httpProvider",
	function($stateProvider, $httpProvider){
		$stateProvider.
		state("login", {
			url: "/login",
			controller: "LoginController",
			templateUrl: "/dist/modules/sessions/views/login.html",
			resolve: {
				user: ["authService", "$q", function(authService, $q){
					if(authService.token) {
						$q.reject({authorized: true});
					}
				}]
			}
		}).
		state("logout", {
			url: "/logout",
			controller: [ "$scope", "authService", "$state",
				function($scope, authService, $state){
					authService.logout();
					$state.go("login");
				}
			]
		});
		
		$httpProvider.interceptors.push("authInterceptor");
	}
]).

run([
	"$rootScope", "$state", 
	function($rootScope, $state){
		$rootScope.$on("$stateChangeError", 
			function(event, toState, toParams, fromState, fromParams, error){
				if(error.authorized){
					$state.go("admin");
				}
			}
		);
	}
]);