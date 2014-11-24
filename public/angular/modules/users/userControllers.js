angular.module("Dagr.users.controllers", []).

controller("SignupController", [
	"$scope", "userService",
	function($scope, userService){
		$scope.buttonText = "Sign Up";
		
		$scope.signup = function(){
			if($scope.signupForm.$valid){
				$scope.buttonText = "Signin in...";
		
				userService.signup({user: $scope.user}).
				success(function(data){
					$state.go("workspace.index");
				}).
				error(function(err){
					$scope.errors = err.errors;
					$scope.invalidLogin = true;
				}).
				finally(function(){
					$scope.buttonText = "Sign Up";
				});
			}
		}
	}
]);