angular.module("Dagr.tasks.controllers", []).

controller("TaskNew", [
	"$scope", "taskService", "$state", "$stateParams", "projectService",
	function($scope, taskService, $state, $stateParams, projectService){
		$scope.task = {};
		$scope.projects = [];
		
		$scope.open = function($event) {
	    	$event.preventDefault();
	    	$event.stopPropagation();

	    	$scope.opened = true;
	  	};
	
		$scope.$watch(function(){
			return $scope.task.client;
		}, function(newClient){
			if(newClient){
				projectService.listByClient(newClient).
				success(function(data){
					$scope.projects = data.projects;
				}).
				error(function(){
					$scope.projects = [];
				})
			}
		});
		
		$scope.newTask = function(){
			taskService.new($scope.task.project, {task: $scope.task}).
			success(function(data){
				$state.go("workspaces.index");
			}).
			error(function(err){
				$scope.errors = err.error;
				$scope.invalid = true;
			});
		}
	}
]);