angular.module("Dagr.admin", [
	"Dagr.admin.services",
	"Dagr.admin.controllers",
	"Dagr.sessions.services"
]).

config([
	"$stateProvider",
	function($stateProvider){
		$stateProvider.
		state("workspaces", {
			url: "/workspaces",
			abstract: true,
			controller: "WorkspaceController",
			templateUrl: "/angular/views/workspaces/home.html",
			resolve: {
				user: ["authService", "$q", function(authService, $q){
					return authService.token || $q.reject({ unauthorized: true });
				}]
			}
		}).
		state("workspaces.index", {
			url: "/index",
			controller: "WorkspaceIndex",
			templateUrl: "/angular/views/workspaces/index.html"
		});
	}
]).

run([
	"$rootScope", "$state", "$window", "authService",
	function($rootScope, $state, $window, authService){
		$rootScope.$on("$stateChangeError", 
			function(event, toState, toParams, fromState, toParams, error){
				if(error.unauthorized){
					$state.go("login");
				}
			}
		);
		authService.token = $window.sessionStorage.token;
	}
]);