"use strict"

angular.module('Dagr', [
	'ngResource', 
	'ui.router',
	'ngAnimate',
	'ngCookies',
	'Dagr.admin',
	'Dagr.sessions'
]).

config([
	"$locationProvider",
	function($locationProvider){
		$locationProvider.html5Mode(true);
	}
]).

run([
	"$state",
	function($state){
		$state.go("login");
	}
]);