angular.module("calendar").

directive("calendar", [
	"moment",
	function(moment){
		return {
			templateUrl: "/dist/modules/calendar/views/calendar.html",
			restrict: "A",
			scope: {
				view: "=calendarView",
				currentDay: "=calendarCurrentDay",
				control: "=calendarControl",
				useIsoWeek: "=calendarUseIsoWeek",
				autoOpen: "=calendarAutoOpen",
				clients: "=clients"
			},
			controller: ["$scope", function($scope){
				var self = this;
				self.titleFunctions = {}
				
				self.changeView = function(view, newDay){
					$scope.view = view;
					$scope.currentDay = newDay;
				}
				
				$scope.control = $scope.control || {};
				
				$scope.control.prev = function(){
					$scope.currentDay = moment($scope.currentDay).subtract(1, $scope.view).toDate();
				}
				
				$scope.control.next = function(){
					$scope.currentDay = moment($scope.currentDay).add(1, $scope.view).toDate();
				}
				
				$scope.control.getTitle = function(){
					if(!self.titleFunctions[$scope.view]) return "";
					return self.titleFunctions[$scope.view]($scope.currentDay);
				}
			}]
			
		}
	}
]).

directive("calendarMonth", [
	"$sce", "$timeout", "calendarHelperService", "projectService", "taskService",
	function($sce, $timeout, calendarHelperService, projectService, taskService){
		return {
			templateUrl: "/dist/modules/calendar/views/month.html",
			restrict: "A",
			require: "^calendar",
			scope: {
				currentDay: "=calendarCurrentDay",
				useIsoWeek: "=calendarUseIsoWeek",
				autoOpen: "=calendarAutoOpen",
				clients: "=clients"
			},
			link: function postLink(scope, element, attrs, calendarController){
				var firstRun = false;
				scope.timeEntry = {};
				scope.$sce = $sce;
				
				calendarController.titleFunctions.month = function(currentDay){
					return moment(currentDay).format("MMMM YYYY");
				}
				
				function updateView(){
					scope.view = calendarHelperService.getMonthView(scope.currentDay, scope.useIsoWeek);
					if(scope.autoOpen && !firstRun){
						scope.view.forEach(function(week, rowIndex){
							if(day.inMonth && moment(scope.currentDay).startOf("day").isSame(day.date.startOf("day"))){
								//scope.dayClicked(rowIndex, cellIndex);
								$timeout(function(){
									firstRun = false;
								});
							}
						});
					}
				}
					
				scope.$watch("currentDay", updateView);
				scope.weekDays = calendarHelperService.getWeekNames(false);
				
				scope.$watch(function(){
					return scope.timeEntry.client;
				}, function(newClient){
					if(newClient){
						projectService.listByClient(newClient).
						success(function(data){
							scope.projects = data.projects;
						}).
						error(function(){
							scope.projects = [];
						});
					}
				});
				
				scope.$watch(function(){
					return scope.timeEntry.project;
				}, function(newProject){
					if(newProject){
						taskService.listByProject(newProject).
						success(function(data){
							scope.tasks = data.tasks;
						}).
						error(function(){
							scope.tasks = [];
						});
					}
				});
				
			}
		}
	}

]);