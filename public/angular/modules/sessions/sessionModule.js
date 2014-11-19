angular.module("Dagr.sessions", [
	"Dagr.sessions.controllers",
	"Dagr.sessions.services"
]).

config([
	"$stateProvider",
	function($stateProvider){
		$stateProvider.
		state("login", {
			url: "/login",
			controller: "SessionController",
			templateUrl: "/angular/views/sessions/login.html",
			resolve: {
				user: ["authService", "$q", function(authService, $q){
					if(authService.user) {
						$q.reject({authorized: true});
					}
				}]
			}
		});
		
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