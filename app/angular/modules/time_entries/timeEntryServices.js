angular.module("Dagr.timeEntries.services", []).

value("NEW_ENTRY", "/api/workspaces/:workspace/time_entry").
value("ENTRY_LIST", "/api/workspaces/:workspace/time_entries/:year/:month").

factory("timeEntryService", [
	"$http", "NEW_ENTRY", "ENTRY_LIST",
	function($http, NEW_ENTRY, ENTRY_LIST){
		var entry = {}
		
		entry.list = function(workspace, year, month){
			workspace = workspace || "";
			var today = new Date();
			year = year || today.getFullYear();
			month = month || today.getMonth();
			return $http.get(ENTRY_LIST.replace(":workspace", workspace).replace(":year", year).replace(":month", month));
		}
		
		entry.new = function(workspace, data){
			workspace = workspace || "";
			return $http.post(NEW_ENTRY.replace(":workspace", workspace), data);
		}
		
		return entry;
	}
])