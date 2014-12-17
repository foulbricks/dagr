angular.module("Dagr.clients", [
	"Dagr.clients.controllers",
	"Dagr.clients.services"
]).

config([
	"$stateProvider",
	function($stateProvider){
		$stateProvider.
		state("workspaces.newClient", {
			url: "/client/new",
			controller: "ClientNew",
			templateUrl: "/dist/modules/clients/views/new.html"
		}).
		state("workspaces.updateClient", {
			url: "/:workspace/client/:id/update",
			controller: "ClientUpdate",
			templateUrl: "/dist/modules/clients/views/update.html"
		}).
		state("workspaces.deleteClient", {
			url: "/:workspace/client/:id/destroy",
			controller: "ClientDelete",
			templateUrl: "/dist/modules/clients/views/delete.html"
		});
	}
]);