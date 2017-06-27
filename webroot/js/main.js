angular.module('rpsApp', []).
service('rpsManager', function(){
	
	var currentState;
	var isInit = true;
	
	return {
			getState: function(){
				return currentState;
			},
			setState: function(stateValue){
				if (stateValue > 0) {
					currentState = stateValue;
				}
			},
			getInit: function(){
				return isInit;
			}, 
			setInit: function(initValue){
				if (initValue != 'undefined') {
					isInit = initValue;
				}
			}
	};
	
}).
controller('rpsController', function($scope, rpsManager) {
	
	var templatePath = 'templates/';
	
	$scope.currentState = 1;
	$scope.templates = [
		{file: templatePath+'intro.tpl'},
		{file: templatePath+'select-item.tpl'},
		{file: templatePath+'select-enemy.tpl'},
		{file: templatePath+'select-player.tpl'},
		{file: templatePath+'game-container.tpl'},
		{file: templatePath+'game-results.tpl'}
	];
	
	$scope.states = [
		{stateNo: 1, name: 'Intro', template: $scope.templates[0]},
		{stateNo: 2, name: 'Type name', template: $scope.templates[1]},
		{stateNo: 3, name: 'Select game item', template: $scope.templates[1]},
		{stateNo: 4, name: 'Select enemy', template: $scope.templates[2]},
		{stateNo: 5, name: 'Select online player', template: $scope.templates[3]},
		{stateNo: 6, name: 'Waiting for player / computer', template: $scope.templates[4]},
		{stateNo: 7, name: 'Game result', template: $scope.templates[4]},
		{stateNo: 8, name: 'View your all game results', template: $scope.templates[5]},
	];
	
	$scope.$on('stateChange', function(e, data){
		
		console.log('State change emit');
		rpsManager.setState(data);
		$scope.stateData = _stateSelect(data);
		
	});
	
	if (rpsManager.getInit() == true) {
		
		$scope.$emit('stateChange', 1);
		rpsManager.setInit(false);
	}
	
	function _stateSelect(stateNo) {
		
		var _stateObj = false;
		
		if (stateNo > 0) {
			for (a=0; a<$scope.states.length; a++) {
				if ($scope.states[a].stateNo == stateNo) {
					_stateObj = $scope.states[a];
				}
			}
		}
		
		return _stateObj;
	}
	
}).
directive('rpsIntro', function(){
	console.log('dir intro');
	return {
		restrict: 'A',
		scope: true,
		link: function(scope){
			console.log('inside link');
			
			TweenMax.staggerTo(".letter", 1, {opacity:1}, 0.3);
			TweenMax.to(".word", 1, {opacity:1, onComplete: function(){
				
				
				
			}}, 1.5).delay(2.4);
		}
	}
	
});