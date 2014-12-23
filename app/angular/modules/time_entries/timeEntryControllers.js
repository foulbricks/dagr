angular.module("Dagr.timeEntries.controllers", []).

controller("TimeEntriesIndex", [
	"$scope", "moment", "workspaceService", "clientService", "projectService",
	function($scope, moment, workspaceService, clientService, projectService){

		$scope.calendarView = "month";
		$scope.calendarDay = new Date();
		
		$scope.setCalendarToToday = function(){
			$scope.calendarDay = new Date();
		}
		
		$scope.setCalendarView = function(view){
			$scope.calendarView = view;
		}
		

		
	}
]);