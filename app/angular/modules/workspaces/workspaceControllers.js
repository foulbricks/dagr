angular.module("Dagr.workspaces.controllers", []).

controller("WorkspaceController", [
	"$scope", "workspaceService",
	function($scope, workspaceService){
		$scope.people = [];
		$scope.projects = [];
		
		$scope.$watch(
			function(){
				return workspaceService.main;
			},
			function(newVal){
				if(newVal){
					$scope.workspace = newVal;
					workspaceService.people($scope.workspace.id).
					success(function(data){
						$scope.people = data.users
					}).
					error(function(err){
						$scope.people = []
					});
				}
			}
		);
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
		$scope.potentialUsers = [];
		$scope.invites = [];
		
		$scope.newWorkspace = function(){
			$scope.workspace.users = $scope.invites;
			workspaceService.new({workspace: $scope.workspace}).
			success(function(data){
				$state.go("workspaces.index");
			}).
			error(function(err){
				$scope.errors = err.error;
				$scope.invalid = true;
			});
		}
		
		$scope.toggleInvites = function(id){
			var index = $scope.invites.indexOf(id);
			index > -1 ? $scope.invites.splice(index, 1) : $scope.invites.push(id); 
		}
		
		workspaceService.suggestions().
		success(function(data){
			$scope.potentialUsers = data.users;
		});
		
	}
]).

controller("WorkspaceInvite", [
	"$scope", "workspaceService", "$state",
	function($scope, workspaceService, $state){
		$scope.potentialUsers = [];
		$scope.invites = [];
		$scope.workspace = {};
		$scope.toggleInvites = function(id){
			var index = $scope.invites.indexOf(id);
			index > -1 ? $scope.invites.splice(index, 1) : $scope.invites.push(id); 
		}
		console.log($scope.workspaceRef)
		$scope.inviteWorkspace = function(){
			$scope.workspace.users = $scope.invites;
			workspaceService.invite({workspace: $scope.workspace}, $scope.workspaceRef.id).
			success(function(data){
				$state.go("workspaces.index");
			}).
			error(function(err){
				$scope.errors = err.error;
				$scope.invalid = true;
			});
		}
		
		workspaceService.suggestions().
		success(function(data){
			$scope.potentialUsers = data.users;
		});
	}
]).

controller("WorkspaceDestroy", [
	"$scope", "workspaceService", "$state",
	function($scope, workspaceService, $state){
		
	}
]).

controller("WorkspaceDeleteMembers", [
	"$scope", "workspaceService", "$state",
	function($scope, workspaceService, $state){
		
	}
]);