angular.module("Dagr.users", [
	"Dagr.users.controllers",
	"Dagr.users.services"
]).

config([
	"$stateProvider",
	function($stateProvider){
		$stateProvider.
		state("signup", {
			url: "/signup",
			controller: "SignupController",
			templateUrl: "dist/modules/users/views/signup.html"
		});
	}
]);