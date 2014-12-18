angular.module("Dagr.tasks.controllers", []).

controller("TaskNew", [
	"$scope", "taskService", "$state", "$stateParams",
	function($scope, clientService, $state, $stateParams){
		$scope.newTask = function(){
			taskService.new($stateParams.project, {task: $scope.task}).
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