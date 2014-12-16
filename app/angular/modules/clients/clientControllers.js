angular.module("Dagr.clients.controllers", []).

controller("ClientList", [
	"$scope", "clientService",
	function($scope, clientService){

	}
]).

controller("ClientNew", [
	"$scope", "clientService", "$state",
	function($scope, clientService, $state){
		$scope.newClient = function(){
			clientService.new($scope.mainWorkspace.id, {client: $scope.client}).
			success(function(data){
				$state.go("workspaces.index");
			}).
			error(function(err){
				$scope.errors = err.error;
				$scope.invalid = true;
			});
		}
	}
]).

controller("ClientUpdate", [
	"$scope",
	function($scope){
		
	}
]).

controller("ClientDelete", [
	"$scope",
	function($scope){
		
	}
]);