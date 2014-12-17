angular.module("Dagr.clients.controllers", []).

controller("ClientList", [
	"$scope", "clientService",
	function($scope, clientService){

	}
]).

controller("ClientNew", [
	"$rootScope", "$scope", "clientService", "$state",
	function($rootScope, $scope, clientService, $state){
		$scope.newClient = function(){
			clientService.new($scope.mainWorkspace.id, {client: $scope.client}).
			success(function(data){
				$rootScope.$broadcast("client:update");
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
	"$rootScope", "$scope", "$state", "$stateParams", "clientService",
	function($rootScope, $scope, $state, $stateParams, clientService){
		
		clientService.one($stateParams.workspace, $stateParams.id).
		success(function(data){
			$scope.client = data.client
		}).
		error(function(err){
			$scope.client = []
		});
		
		$scope.updateClient = function(){
			clientService.update($scope.mainWorkspace.id, $stateParams.id, {client: $scope.client}).
			success(function(){
				$rootScope.$broadcast("client:update");
				$state.go("workspaces.index");
			}).
			error(function(){
				$scope.errors = err.error;
				$scope.invalid = true;
			});
		}
	}
]).

controller("ClientDelete", [
	"$rootScope", "$scope", "$state", "$stateParams", "clientService",
	function($rootScope, $scope, $state, $stateParams, clientService){
		
		clientService.one($stateParams.workspace, $stateParams.id).
		success(function(data){
			$scope.client = data.client
		});
		
		$scope.deleteClient = function(){
			clientService.delete($stateParams.workspace, $stateParams.id).
			success(function(){
				$rootScope.$broadcast("client:update");
				$state.go("workspaces.index");
			});
		}
	}
]);