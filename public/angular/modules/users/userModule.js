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
			templateUrl: "angular/views/users/signup.html"
		});
	}
]);