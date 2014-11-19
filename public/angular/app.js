"use strict"

angular.module('Dagr', [
	'ngResource', 
	'ui.router',
	'ngAnimate',
	'ngCookies',
	'Dagr.admin'
]).

run([
	"$state",
	function($state){
		$state.go("login");
	}
]);