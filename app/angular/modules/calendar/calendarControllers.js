angular.module("calendar").

controller("CalendarController", [
	"$scope", "moment",
	function($scope, moment){
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