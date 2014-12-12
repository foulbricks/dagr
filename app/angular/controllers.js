angular.module("Dagr").

controller("NavController", [
	"$rootScope", "$window", "$scope", "authService", "workspaceService",
	function($rootScope, $window, $scope, authService, workspaceService){
		$scope.loggedIn = false;
		$scope.user = authService.user;
		$scope.name = authService.user ? authService.user.name : "Stranger";
		$scope.workspaces = [];
		getWorkspaceList();
		
		$scope.$watch(
			function(){
				return authService.user;
			}, function(newVal){
				if(newVal){
					$scope.loggedIn = true;
					$scope.name = authService.user.name;
					getWorkspaceList();
				}
				else {
					$scope.loggedIn = false;
				}
			}
		);
		
		$scope.changeWorkspace = function(id){
			var ids = $scope.workspaces.map(function(w){ return w.id });
			var index = ids.indexOf(id);
			var main = $scope.workspaces.splice(index, 1, $scope.mainWorkspace);
			$scope.mainWorkspace = workspaceService.main = main[0];
			$window.localStorage.workspace = JSON.stringify(main[0]);
		}
		
		function getWorkspaceList(){
			workspaceService.list().success(function(data){
				if(data.workspaces){
					workspaceService.main = workspaceService.main || data.workspaces[0];
					$window.localStorage.workspace = JSON.stringify(workspaceService.main);
					$scope.mainWorkspace = workspaceService.main;
					
					if(data.workspaces.length > 1){
						var ids = data.workspaces.map(function(w){ return w.id });
						var index = ids.indexOf(workspaceService.main.id);
						data.workspaces.splice(index, 1);
					}
					$scope.workspaces = data.workspaces;
				}
			}).
			error(function(err){
				$scope.workspaces = [];
			});
		}
	}
]);