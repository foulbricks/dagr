angular.module("Dagr.projects.controllers", []).

controller("ProjectNew", [
	"$rootScope", "$scope", "projectService", "$state",
	function($rootScope, $scope, projectService, $state){
		$scope.project = {}
		
		$scope.newProject = function(){
			projectService.new($scope.project.client, {project: $scope.project}).
			success(function(data){
				$rootScope.$broadcast("project:update");
				$state.go("workspaces.index");
			}).
			error(function(err){
				$scope.errors = err.error;
				$scope.invalid = true;
			});
		}
	}
]).

controller("ProjectUpdate", [
	"$rootScope", "$scope", "projectService", "$state", "$stateParams",
	function($rootScope, $scope, projectService, $state, $stateParams){
		
	}
]).

controller("ProjectDelete", [
	"$rootScope", "$scope", "projectService", "$state", "$stateParams",
	function($rootScope, $scope, projectService, $state, $stateParams){
		
	}
]);