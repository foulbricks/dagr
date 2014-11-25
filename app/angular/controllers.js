angular.module("Dagr").

controller("NavController", [
	"$scope", "authService",
	function($scope, authService){
		console.log(authService)
		$scope.loggedIn = authService.token !== undefined;
		$scope.name = authService.user && [authService.user.name.first, authService.user.name.last].join(" ") || "Stranger";
		
		$scope.$on("user:logged", function(event, bool){
			$scope.loggedIn = bool;
			if(bool){
				$scope.name = [authService.user.name.first, authService.user.name.last].join(" ");
			}
		});
	}
]);