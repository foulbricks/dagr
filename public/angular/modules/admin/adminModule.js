angular.module("Dagr.admin", [
	"Dagr.admin.services",
	"Dagr.admin.controllers",
	"Dagr.sessions.services"
]).

config([
	"$stateProvider",
	function($stateProvider){
		$stateProvider.
		state("admin", {
			url: "/admin",
			abstract: true,
			controller: "AdminController",
			templateUrl: "/views/admin/home.html",
			resolve: {
				user: ["authService", "$q", function(authService, $q){
					return authService.user || $q.reject({ unauthorized: true });
				}]
			}
		});
	}
]).

run([
	"$rootScope", "$state", "$cookieStore", "authService",
	function($rootScope, $state, $cookieStore, authService){
		$rootScope.$on("$stateChangeError", 
			function(event, toState, toParams, fromState, toParams, error){
				if(error.unauthorized){
					$state.go("login");
				}
			}
		);
	}
]);