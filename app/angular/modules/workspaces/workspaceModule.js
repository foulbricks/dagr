angular.module("Dagr.workspaces", [
	"Dagr.workspaces.services",
	"Dagr.workspaces.controllers"
]).

config([
	"$stateProvider",
	function($stateProvider){
		$stateProvider.
		state("workspaces", {
			url: "/workspaces",
			abstract: true,
			controller: "WorkspaceController",
			templateUrl: "/dist/modules/workspaces/views/home.html",
			resolve: {
				user: ["authService", "$q", function(authService, $q){
					return authService.token || $q.reject({ unauthorized: true });
				}]
			}
		}).
		state("workspaces.index", {
			url: "/list",
			controller: "WorkspaceIndex",
			templateUrl: "/dist/modules/workspaces/views/index.html"
		}).
		state("workspaces.new", {
			url: "/new",
			controller: "WorkspaceNew",
			templateUrl: "/dist/modules/workspaces/views/new.html"
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
		authService.user = $window.localStorage.user && JSON.parse($window.localStorage.user);
		authService.token = $window.sessionStorage.token;
	}
]);