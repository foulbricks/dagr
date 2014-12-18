"use strict"

angular.module("calendar", ["ui.bootstrap"]).
run(["moment", function(moment){
	moment.locale("en");
}]);