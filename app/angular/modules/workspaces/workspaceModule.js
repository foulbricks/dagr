angular.module("Dagr.workspaces", [
	"Dagr.workspaces.services",
	"Dagr.workspaces.controllers",
	"Dagr.clients.controllers",
	"Dagr.clients.services"
]).

config([
	"$stateProvider",
	function($stateProvider){
		$stateProvider.
		state("workspaces", {
			url: "/workspaces",
			abstract: true,
			controller: "WorkspaceController",
			templateUrl: "/dist/modules/workspaces/views/home.html",
			resolve: {
				user: ["authService", "$q", function(authService, $q){
					return authService.token || $q.reject({ unauthorized: true });
				}]
			}
		}).
		state("workspaces.index", {
			url: "/list",
			controller: "WorkspaceIndex",
			templateUrl: "/dist/modules/workspaces/views/index.html"
		}).
		state("workspaces.new", {
			url: "/new",
			controller: "WorkspaceNew",
			templateUrl: "/dist/modules/workspaces/views/new.html"
		}).
		state("workspaces.manageInvites", {
			url: "/manage-invitations",
			controller: "WorkspaceManageInvitations",
			templateUrl: "/dist/modules/workspaces/views/manageInvitations.html"
		}).
		state("workspaces.invite", {
			url: "/invite",
			controller: "WorkspaceInvite",
			templateUrl: "/dist/modules/workspaces/views/invites.html"
		}).
		state("workspaces.delete", {
			url: "/delete",
			controller: "WorkspaceDestroy",
			templateUrl: "/dist/modules/workspaces/views/destroy.html"
		}).
		state("workspaces.deleteMembers", {
			url: "/delete-members",
			controller: "WorkspaceDeleteMembers",
			templateUrl: "/dist/modules/workspaces/views/delete_members.html"
		}).
		state("workspaces.newClient", {
			url: "/client/new",
			controller: "ClientNew",
			templateUrl: "/dist/modules/clients/views/new.html"
		});
	}
]).

run([
	"$rootScope", "$state", "$window", "workspaceService", "authService",
	function($rootScope, $state, $window, workspaceService, authService){
		$rootScope.$on("$stateChangeError", 
			function(event, toState, toParams, fromState, toParams, error){
				if(error.unauthorized){
					$state.go("login");
				}
			}
		);
		authService.user = $window.localStorage.user && JSON.parse($window.localStorage.user);
		workspaceService.main = $window.localStorage.workspace && JSON.parse($window.localStorage.workspace);
		authService.token = $window.sessionStorage.token;
	}
]);