angular.module("Dagr.workspaces.controllers", []).

controller("WorkspaceController", [
	"$scope", "workspaceService",
	function($scope, workspaceService){
		$scope.people = [];
		$scope.projects = [];
		
		$scope.$on("workspace:change", function(event, workspace){
			workspaceService.people(workspace.id).success(function(data){
				$scope.people = data.users
			}).
			error(function(err){
				$scope.people = []
			});
		});
	}
]).

controller("WorkspaceIndex", [
	"$scope", "workspaceService",
	function($scope, workspaceService){
		$scope.workspaces = []
		
		workspaceService.list().success(function(data){
			$scope.workspaces = data.workspaces;
		}).
		error(function(err){
			$scope.workspaces = []
		});
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