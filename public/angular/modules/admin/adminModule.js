angular.module("Dagr.admin", [
	"Dagr.admin.services",
	"Dagr.admin.controllers"
]).

config([
	"$stateProvider", "$locationProvider",
	function($stateProvider, $locationProvider){
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
			}).
			state("login", {
				url: "/login",
				controller: "LoginController",
				templateUrl: "angular/views/sessions/login.html",
				resolve: {
					user: ["authService", "$q", function(authService, $q){
						if(authService.user){
							return $q.reject({authorized: true});
						}
					}]
				}
			});
			$locationProvider.html5Mode(true);
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
				
				if(error.authorized){
					$state.go("test");
				}
			}
		);
	}
]);