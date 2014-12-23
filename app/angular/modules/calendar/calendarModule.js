"use strict"

angular.module("calendar", []).
run(["moment", function(moment){
	moment.locale("en");
}]);