angular.module('rpsApp', []).
service('rpsManager', function(){
	
	var currentState;
	var isInit = true;
	var playerNick;
	
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
				if (initValue != undefined) {
					isInit = initValue;
				}
			},
			getPlayerNick: function(){
				return playerNick;
			},
			setPlayerNick: function(nick){
				if (nick != undefined) {
					playerNick = nick;
				}
			}
	};
	
}).
controller('rpsController', function($scope, rpsManager) {
	
	var templatePath = 'templates/';
	var test = 'lubie testy';
	var parentScope = $scope;
	$scope.data = {};
	
	$scope.data.templates = [
		{file: templatePath+'intro.tpl'},
		{file: templatePath+'select-item.tpl'},
		{file: templatePath+'select-enemy.tpl'},
		{file: templatePath+'select-player.tpl'},
		{file: templatePath+'game-container.tpl'},
		{file: templatePath+'game-results.tpl'}
	];
	
	$scope.data.states = [
		{stateNo: 1, name: 'Intro', template: $scope.data.templates[0]},
		{stateNo: 2, name: 'Type name', template: $scope.data.templates[1]},
		{stateNo: 3, name: 'Select game item', template: $scope.data.templates[1]},
		{stateNo: 4, name: 'Select enemy', template: $scope.data.templates[2]},
		{stateNo: 5, name: 'Select online player', template: $scope.data.templates[3]},
		{stateNo: 6, name: 'Waiting for player / computer', template: $scope.data.templates[4]},
		{stateNo: 7, name: 'Game result', template: $scope.data.templates[4]},
		{stateNo: 8, name: 'View your all game results', template: $scope.data.templates[5]},
	];
	
	$scope.$on('stateChange', function(e, data){
		
		console.log('state change: '+data);
		
		rpsManager.setState(data);
		$scope.data.stateData = _stateSelect(data);
		
		if (!$scope.$$phase) {
			$scope.$digest();
		}
	});
	
	if (rpsManager.getInit() == true) {
		
		$scope.$emit('stateChange', 1);
		rpsManager.setInit(false);
	}
	
	function _stateSelect(stateNo) {
		
		var _stateObj = false;
		
		if (stateNo > 0) {
			for (a=0; a<$scope.data.states.length; a++) {
				if ($scope.data.states[a].stateNo == stateNo) {
					_stateObj = $scope.data.states[a];
				}
			}
		}
		return _stateObj;
	}
	
}).
directive('rpsIntro', function(){
	
	return {
		scope: true,
		transclude: false, 
		link: function(scope, element, attrs){
			TweenMax.staggerTo(".letter", 1, {opacity:1}, 0.3);
			TweenMax.to(".word", 1, {opacity:1, onComplete: function(){
				TweenMax.to(".rps_intro", 1, {opacity: 0, onComplete: function(){
					scope.$emit('stateChange', 2);
				}}, 1.5).delay(0.5);
			}}, 1.5).delay(2.4);
		}
	}
	
}).
directive('rpsSelectItem', function(rpsManager){
	
	return {
		scope: true,
		transclude: false, 
		link: function(scope, element, attrs){
		
			var playerNick = rpsManager.getPlayerNick();
			
			if (playerNick == undefined) {
				TweenMax.to($('.player-nick'), 1.25, {css: {transform: "translateY(0)"}, ease:Power2.easeOut});
			} else {
				
			}
			
			/*TweenMax.staggerTo(".letter", 1, {opacity:1}, 0.3);
			TweenMax.to(".word", 1, {opacity:1, onComplete: function(){
				TweenMax.to(".rps_intro", 1, {opacity: 0, onComplete: function(){
					scope.$emit('stateChange', 2);
				}}, 1.5).delay(0.5);
			}}, 1.5).delay(2.4);*/
		}
	}
	
});