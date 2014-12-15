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
					$scope.mainWorkspace = newVal;
					workspaceService.people($scope.mainWorkspace.id).
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
	"$scope", "workspaceService", "authService",
	function($scope, workspaceService, authService){
		$scope.workspaces = []
		$scope.$watch(
			function(){
				return authService.user;
			},
			function(newVal){
				$scope.user = newVal;
			}
		);
		
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
		$scope.workspace = {}
		
		$scope.toggleInvites = function(id){
			var index = $scope.invites.indexOf(id);
			index > -1 ? $scope.invites.splice(index, 1) : $scope.invites.push(id); 
		}

		$scope.inviteWorkspace = function(){
			$scope.workspace.users = $scope.invites;
			workspaceService.invite({workspace: $scope.workspace}, $scope.mainWorkspace.id).
			success(function(data){
				$state.go("workspaces.index");
			}).
			error(function(err){
				$scope.errors = err.error;
				$scope.invalid = true;
			});
		}
		
		$scope.$watch(
			function(){
				return workspaceService.main;
			},
			function(newVal){
				if(newVal){
					workspaceService.suggestions(newVal.id).
					success(function(data){
						$scope.potentialUsers = data.users;
					});
				}
			}
		);
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
]).

controller("WorkspaceManageInvitations", [
	"$scope", "workspaceService", "$state", "authService",
	function($scope, workspaceService, $state, authService){
		$scope.workspaces = [];
		
		$scope.$watch(function(){
			return authService.user;
		}, function(user){
			if(user && user.invites){
				user.invites.map(function(id){
					workspaceService.show(id).
					success(function(workspace){
						$scope.workspaces.push(workspace.workspace);
					});
				});
			}
		});
	}
]);