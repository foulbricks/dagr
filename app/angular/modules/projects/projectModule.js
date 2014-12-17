angular.module("Dagr.projects", [
	"Dagr.projects.controllers",
	"Dagr.projects.services"
]).

config([
	"$stateProvider",
	function($stateProvider){
		$stateProvider.
		state("workspaces.newProject", {
			url: "/project/new",
			controller: "ProjectNew",
			templateUrl: "/dist/modules/projects/views/new.html"
		}).
		state("workspaces.updateProject", {
			url: "/project/update/:id",
			controller: "ProjectUpdate",
			templateUrl: "/dist/modules/projects/views/update.html"
		}).
		state("workspaces.deleteProject", {
			url: "/project/delete/:id",
			controller: "ProjectUpdate",
			templateUrl: "/dist/modules/projects/views/delete.html"
		});
	}
]);