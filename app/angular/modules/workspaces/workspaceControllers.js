angular.module("Dagr.workspaces.controllers", []).

controller("WorkspaceController", [
	"$rootScope", "$scope", "workspaceService", "clientService", "projectService",
	function($rootScope, $scope, workspaceService, clientService, projectService){
		$scope.people = [];
		$scope.projects = [];
		$scope.clients = [];
		
		$scope.$watch(
			function(){
				return workspaceService.main;
			},
			function(newVal){
				if(newVal){
					$scope.mainWorkspace = newVal;
					peopleList();
					clientList($scope.mainWorkspace.id);
					projectList($scope.mainWorkspace.id);
				}
			}
		);
		
		$scope.$on("client:update", function(){
			clientList($scope.mainWorkspace.id);
		});
		
		$scope.$on("project:update", function(){
			projectList($scope.mainWorkspace.id);
		});
		
		function peopleList(){
			workspaceService.people($scope.mainWorkspace.id).
			success(function(data){
				$scope.people = data.users
				$rootScope.$broadcast("users:list", data.users);
			}).
			error(function(err){
				$scope.people = []
			});
		}
		
		function clientList(workspace_id){
			clientService.list(workspace_id).
			success(function(data){
				$scope.clients = data.clients;
			}).
			error(function(err){
				$scope.clients = [];
			});
		}
		
		function projectList(workspace_id){
			projectService.list(workspace_id).
			success(function(data){
				$scope.projects = data.projects;
			}).
			error(function(err){
				$scope.projects = [];
			});
		}
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
	"$rootScope", "$scope", "workspaceService", "$state",
	function($rootScope, $scope, workspaceService, $state){

		$scope.deleteWorkspace = function(){
			workspaceService.delete($scope.mainWorkspace.id).
			success(function(){
				workspaceService.main = null;
				$rootScope.$broadcast("workspace:reload");
				$state.go("workspaces.index");
			});
		}
	}
]).

controller("WorkspaceDeleteMembers", [
	"$rootScope", "$scope", "workspaceService", "$state",
	function($rootScope, $scope, workspaceService, $state){
		$scope.members = [];
		$scope.$on("users:list", function(event, peeps){
			peeps.forEach(function(person){
				if($scope.mainWorkspace.owner != person.id){
					$scope.members.push(person);
				}
			});
		});
		
		$scope.deleteMember = function(id){
			workspaceService.deleteMember($scope.mainWorkspace.id, id).
			success(function(){
				var index = $scope.people.indexOf(id);
				$scope.people.splice(index, 1);
				var mIndex = $scope.members.indexOf(id);
				$scope.members.splice(mIndex, 1);
			});
		}
	}
]).

controller("WorkspaceManageInvitations", [
	"$rootScope", "$scope", "workspaceService", "$state", "authService", "$window",
	function($rootScope, $scope, workspaceService, $state, authService, $window){
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
			else {
				$scope.worskpaces = [];
			}
		});
		
		$scope.joinWorkspace = function(id){
			workspaceService.join(id).
			success(function(){
				var index = authService.user.invites.indexOf(id);
				if(index > -1){
					var wIndex = $scope.workspaces.indexOf(id);
					$scope.workspaces.splice(wIndex, 1);
					authService.user.invites.splice(index, 1);
					$window.localStorage.user = JSON.stringify(authService.user);
					$rootScope.$broadcast("workspace:reload");
				}
			});
		}
		
		$scope.dismissInvite = function(id){
			workspaceService.dismiss(id).
			success(function(){
				var index = authService.user.invites.indexOf(id);
				if(index > -1){
					authService.user.invites.splice(index, 1);
					$window.localStorage.user = JSON.stringify(authService.user);
					var wIndex = $scope.workspaces.indexOf(id);
					$scope.workspaces.splice(wIndex, 1);
				}
			});
		}
	}
]);