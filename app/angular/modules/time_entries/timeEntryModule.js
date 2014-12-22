angular.module("Dagr.timeEntries", [
	"Dagr.timeEntries.controllers",
	"calendar"
]).

config([
	"$stateProvider",
	function($stateProvider){
		$stateProvider.
		state("workspaces.timeEntries", {
			url: "/time-entries",
			controller: "TimeEntriesIndex",
			templateUrl: "/dist/modules/time_entries/views/index.html"
		});
	}
]);