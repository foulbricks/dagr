angular.module("Dagr").

controller("NavController", [
	"$rootScope", "$scope", "authService", "workspaceService",
	function($rootScope, $scope, authService, workspaceService){
		$scope.loggedIn = authService.token !== undefined;
		$scope.user = authService.user;
		$scope.name = authService.user && [authService.user.name.first, authService.user.name.last].join(" ") || "Stranger";
		$scope.workspaces = [];
		getWorkspaceList();
		
		$scope.$on("user:logged", function(event, bool){
			$scope.loggedIn = bool;
			if(bool){
				$scope.name = [authService.user.name.first, authService.user.name.last].join(" ");
			}
			getWorkspaceList();
		});
		
		function getWorkspaceList(){
			workspaceService.list().success(function(data){
				$scope.workspaces = data.workspaces;
				if(data.workspaces.length > 0){
					$rootScope.$broadcast("workspace:change", data.workspaces[0]);
					$window.localStorage.workspace = JSON.stringify(data.workspaces[0]);
				}
			}).
			error(function(err){
				$scope.workspaces = [];
			});
		}
	}
]);