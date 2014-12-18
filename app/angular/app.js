"use strict"

angular.module('Dagr', [
	'ngResource', 
	'ui.router',
	'ngAnimate',
	'ngCookies',
	'Dagr.workspaces',
	'Dagr.sessions',
	'Dagr.users',
	'Dagr.clients',
	'Dagr.projects',
	'Dagr.tasks',
	'Dagr.timeEntries'
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