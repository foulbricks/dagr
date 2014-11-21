angular.module("Dagr.sessions.controllers", []).

controller("LoginController", [
	"$scope", "authService", "$state",
	function($scope, authService, $state){
		$scope.buttonText = "Login";
		
		$scope.login = function(){
			$scope.buttonText = "Logging in...";
			
			authService.login($scope.credentials.email, $scope.credentials.password).
			
			success(function(data){
				$state.go("workspaces.index");
			}).
			
			error(function(err){
				$scope.invalidLogin = true;
			}).
			
			finally(function(){
				$scope.buttonText = "Login";
				$scope.credentials.password = "";
			});
		}
	}
]);