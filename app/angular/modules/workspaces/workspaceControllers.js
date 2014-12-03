angular.module("Dagr.workspaces.controllers", []).

controller("WorkspaceController", [
	"$scope",
	function($scope){
		
	}
]).

controller("WorkspaceIndex", [
	"$scope", "workspaceService",
	function($scope, workspaceService){
		$scope.workspaces = workspaceService.list();
	}
]).

controller("WorkspaceNew", [
	"$scope", "workspaceService", "$state",
	function($scope, workspaceService, $state){
		
		$scope.newWorkspace = function(){
			workspaceService.new({workspace: $scope.workspace}).
			success(function(data){
				$state.go("workspaces.index");
			}).
			error(function(err){
				$scope.errors = err.errors;
				$scope.invalid = true;
			});
		}
		
	}
])