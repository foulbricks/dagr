angular.module("Dagr.tasks", [
	"Dagr.tasks.controllers",
	"Dagr.tasks.services"
]).

config([
	"$stateProvider",
	function($stateProvider){
		$stateProvider.
		state("workspaces.newTask", {
			url: "/task/new",
			controller: "TaskNew",
			templateUrl: "/dist/modules/tasks/views/new.html"
		}).
		state("workspaces.updateTask", {
			url: "/:project/task/:id/update",
			controller: "TaskUpdate",
			templateUrl: "/dist/modules/tasks/views/update.html"
		}).
		state("workspaces.deleteTask", {
			url: "/:project/task/:id/destroy",
			controller: "TaskDelete",
			templateUrl: "/dist/modules/tasks/views/delete.html"
		});
	}
]);