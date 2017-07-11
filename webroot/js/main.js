angular.module('rpsApp', ['ngResource', 'btford.socket-io']).
service('rpsManager', function(){
	
	var currentState;
	var isInit = true;
	var playerNick;
	var playerItem = false;
	var playerEnemy = false;
	var playerEnemyData = {};
	var playerLastGame = {};
	var playerGameHistory = [];
	var gameId = false;
	var mySessionId;
	
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
			},
			getPlayerItem: function() {
				return playerItem;
			}, 
			setPlayerItem: function(item) {
				if (item != undefined) {
					playerItem = item;
				}
			},
			getPlayerEnemy: function() {
				return playerEnemy;
			}, 
			setPlayerEnemy: function(enemy) {
				if (enemy != undefined) {
					playerEnemy = enemy;
				}
			},
			getPlayerGameHistory: function(){
				return playerGameHistory;
			}, 
			addPlayerGameHistory: function(gameObject) {
				if (gameObject != undefined) {
					playerGameHistory.push(gameObject);
				}
			},
			getPlayerLastGame: function() {
				return playerLastGame;
			}, 
			setPlayerLastGame: function(gameObject) {
				if (gameObject != undefined) {
					playerLastGame = gameObject;
				}
			},
			getPlayerEnemyData: function() {
				return playerEnemyData;
			}, 
			setPlayerEnemyData: function(enemyDataObject) {
				if (enemyDataObject != undefined) {
					playerEnemyData = enemyDataObject;
				}
			}, 
			getGameId: function() {
				return gameId;
			}, 
			setGameId: function(gameId) {
				if (gameId != undefined) {
					gameId = gameId;
				}
			},
			getMySessionId: function() {
				return mySessionId;
			}, 
			setMySessionId: function(sessionId) {
				if (sessionId != undefined) {
					mySessionId = sessionId;
				}
			}
	};
	
}).
factory('rpsSocket', function (socketFactory) {
  
  return {
	  connect: function() {
		  return socketFactory();
	  }
  }
}).
controller('rpsController', function($scope, rpsManager) {
	
	var templatePath = 'templates/';
	
	//---@TODO
	var itemConnexions = [];
	var rockArray = [];
	var paperArray = [];
	var scissorsArray = [];
	rockArray['scissors'] = 1;
	rockArray['paper'] = 0;
	paperArray['rock'] = 1;
	paperArray['scissors'] = 0;
	scissorsArray['paper'] = 1;
	scissorsArray['rock'] = 0;
	
	itemConnexions['rock'] = rockArray;
	itemConnexions['paper'] = paperArray;
	itemConnexions['scissors'] = scissorsArray;
	//---
	
	$scope.data = {};
	$scope.data.items = [
		'rock',
		'paper',
		'scissors'
	];
	$scope.data.templates = [
		{file: templatePath+'intro.tpl'},
		{file: templatePath+'select-item.tpl'},
		{file: templatePath+'select-enemy.tpl'},
		{file: templatePath+'select-player.tpl'},
		{file: templatePath+'game-container.tpl'},
		{file: templatePath+'game-result.tpl'},
		{file: templatePath+'games-history.tpl'}
	];
	$scope.data.states = [
		{stateNo: 1, name: 'Intro', template: $scope.data.templates[0]},
		{stateNo: 2, name: 'Select game item', template: $scope.data.templates[1]},
		{stateNo: 3, name: 'Select enemy', template: $scope.data.templates[2]},
		{stateNo: 4, name: 'Select online player', template: $scope.data.templates[3]},
		{stateNo: 5, name: 'Waiting for player / computer', template: $scope.data.templates[4]},
		{stateNo: 6, name: 'Game result', template: $scope.data.templates[5]},
		{stateNo: 7, name: 'View your all game results', template: $scope.data.templates[6]},
	];
	$scope.data.connexions = itemConnexions;
	
	$scope.$on('stateChange', function(e, data){
		
		console.log('state change: '+data);
		
		rpsManager.setState(data);
		$scope.data.stateData = _stateSelect(data);
		
		if (!$scope.$$phase) {
			$scope.$digest();
		}
	});
	
	$scope.drawItem = function() {
		var randomKey = Math.floor(Math.random() * (2 - 0 + 1));
		var drawItem = $scope.data.items[randomKey];
		return drawItem;
	}
	
	//---  1=> wins, 0 => loses, -1 => draw
	$scope.compareItems = function(player1, player2) {
		
		if (player1 != undefined && player2 != undefined) {
			if (player1.item != player2.item) {
				
				var player1Result = $scope.data.connexions[player1.item][player2.item]; 
				var player2Result = $scope.data.connexions[player2.item][player1.item]; 
				/*return {
					player1: player1Result,
					player2: player2Result
				};*/
				return player1Result;
			} else {
				return -1;
			}
		}
	}
	
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
		
			scope.inputError = false;
			scope.selectedItem = false;
			var playerNick = rpsManager.getPlayerNick();
			
			if (playerNick == undefined) {
				TweenMax.to($('.player-nick'), 0.8, {css: {transform: "translateY(0)"}, ease:Power2.easeOut});
			} else {
				TweenMax.to($('.items-to-select'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut});
			}
			
			scope.savePlayerNick = function(){
				var nick = scope.playerName;
				
				if (nick != '' && nick != undefined && nick.length >= 3) {
					scope.inputError = false;
					rpsManager.setPlayerNick(nick);
					TweenMax.to($('.player-nick'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut, onComplete: function(){
							TweenMax.to($('.items-to-select'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut});
					}});
					
				} else {
					scope.inputError = true;
				}
				
			}
			
			scope.selectItem = function(item){
				
				if (item != '' && item != undefined) {
					scope.selectedItem = item;
					rpsManager.setPlayerItem(item);
					
					TweenMax.to($('.rps_select_item'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut, onComplete: function(){
						scope.$emit('stateChange', 3);
					}});
					
				}
				
			}
			
		}
	}
	
}).
directive('rpsSelectEnemy', function(rpsManager){
	return {
		scope: true,
		transclude: false, 
		link: function(scope, element, attrs){
			
			scope.selectedEnemy = false;

			TweenMax.to($('.enemies-to-select'), 0.8, {css: {transform: "translateY(0)"}, ease:Power2.easeOut});
			
			scope.selectEnemy = function(enemy){
				
				if (enemy != '' && enemy != undefined) {
					scope.selectedEnemy = enemy;
					rpsManager.setPlayerEnemy(enemy);
					
					TweenMax.to($('.rps_select_enemy'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut, onComplete: function(){						
						
						if (enemy == 'computer') scope.$emit('stateChange', 5);
						else if (enemy == 'player') scope.$emit('stateChange', 4);

					}});
				}	
			}
		}
	};
}).
directive('rpsGameContainer', function(rpsManager, $resource){
	return {
		scope: true,
		transclude: false,
		link: function(scope, element, attrs) {
			
			var currentEnemy =  rpsManager.getPlayerEnemy();
			
			//--- always me
			var myItem = rpsManager.getPlayerItem(); 
			scope.player1 = {player: rpsManager.getPlayerNick(), item: myItem, status: 'ready'};
			
			 if (currentEnemy == 'computer') {

				var itemDraw = scope.drawItem();
				scope.gameId = 'computer';
				scope.player2 = {player: 'Computer', item: itemDraw, status: 'waiting'};
				
			 } else if (currentEnemy == 'player') {
				 
				 var playerEnemyData = rpsManager.getPlayerEnemyData();
				 scope.gameId = playerEnemyData.gameId;
				 scope.player2 = {player: playerEnemyData.nick, item: playerEnemyData.item, status: playerEnemyData.item};
			 }
			
			var gameResult = scope.compareItems(scope.player1, scope.player2);
			
			TweenMax.to($('.player1'), 0.8, {css: {transform: "translateX(0vw)"}, ease:Power2.easeOut});
			TweenMax.to($('.player2'), 0.8, {css: {transform: "translateX(0vw)"}, ease:Power2.easeOut, onComplete: function(){		
				
				TweenMax.to($('.status-container h1'), 0.8, {css: {opacity: 0}, ease:Power2.easeOut, onComplete: function(){
					
					if (currentEnemy == 'player') {
						console.log('try to delete game:' + scope.gameId);
						var deleteGame = $resource("/game/deletegame/:gameid", {gameid: '@gameid'});
						deleteGame.save({gameid: scope.gameId});
					}
					
					var currentGame = {
						gameId: scope.gameId,
						gameResult: gameResult,
						player1: scope.player1,
						player2: scope.player2
					};
					rpsManager.addPlayerGameHistory(currentGame);
					rpsManager.setPlayerLastGame(currentGame);
					
					scope.player2.status = scope.player2.item;
					
					scope.$apply();
					
					TweenMax.to($('.player1 .status-container'), 0.8, {css: {transform: "translateX(-100vw)"}, ease:Power2.easeOut});
					TweenMax.to($('.player2 .status-container'), 0.8, {css: {transform: "translateX(100vw)"}, ease:Power2.easeOut, onComplete: function(){
						
						TweenMax.to($('.rps_game_container'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut, onComplete: function(){
							scope.$emit('stateChange', 6);
						}}).delay(2);
						
					}});
				}}).delay(2);
				
			}});
			
		}
	}
}).
directive('rpsSelectPlayer', function(rpsManager, $resource){
	
	return {
		scope: true,
		transclude: false,
		link: function(scope, element, attrs) {
			
			TweenMax.to($('.rps_select_player'), 0.8, {css: {transform: "translateY(0vh)"}, ease:Power2.easeOut});
			
			/*rpsSocket.on('test', function(data){
				console.log('Zwrotka do TEST');
			});*/
			
			scope.selectPlayer = function(player) {
				
				if (player != '' && player != undefined) {
					
					rpsManager.setPlayerEnemy('player');
					
					TweenMax.to($('.players-to-select'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut, onComplete: function(){
						if (player == 'local') {
							
							// @TODO
							TweenMax.to($('.local-play'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut});
							
						} else if (player == 'remote') {
							
							var mySession = $resource("/game/getsession");
							var mySessionData = mySession.save();
							
							mySessionData.$promise.then(function(sessionData){
								
								rpsManager.setMySessionId(sessionData.sessionID);
								var gamePlay = $resource("/game/nick/:nick/item/:item/sessionid/:sessionid", {nick: '@nick', item: '@item', sessionid: '@sessionid'});
								var gameData = gamePlay.save({
										nick: rpsManager.getPlayerNick(), 
										item: rpsManager.getPlayerItem(), 
										sessionid: rpsManager.getMySessionId()
									});
								
								gameData.$promise.then(
									function (result) {
									
										console.log('promise z grą jest !');
										
										if (result.gameId != undefined && result.nick != undefined && result.item != undefined) {
											
											rpsManager.setPlayerEnemyData({gameId: result.gameId, nick: result.nick, item: result.item});
											console.log('result: ', result);
											TweenMax.to($('.rps_select_player'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut, onComplete: function(){
												scope.$emit('stateChange', 5);
											}}).delay(2);
										}
									}, 
									function (error) {
										console.log(error);
									}, 
									function (progress) {
										console.log(progress);
									});
							});
							
							TweenMax.to($('.remote-play'), 0.8, {css: {transform: "translateY(-200vh)"}, ease:Power2.easeOut});
						}
					}});
				}
			}
			
		}
	}
}).
directive('rpsGameResult', function(rpsManager){
	return {
		scope: true,
		transclude: false,
		link: function(scope, element, attrs) {
			
			TweenMax.to($('.rps_game_result'), 0.8, {css: {transform: "translateY(0vh)"}, ease:Power2.easeOut});
			scope.playerLastGame = rpsManager.getPlayerLastGame();
			
			scope.playAgain = function(){
				TweenMax.to($('.rps_game_result'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut, onComplete: function(){
					scope.$emit('stateChange', 5);
				}});
			};
			
			scope.goToMainMenu = function(){
				console.log('go main menu');
				TweenMax.to($('.rps_game_result'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut, onComplete: function(){
					scope.$emit('stateChange', 2);
				}});
			};
			
			scope.showGameHistory = function(){
				TweenMax.to($('.rps_game_result'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut, onComplete: function(){
					scope.$emit('stateChange', 7);
				}});
			};
			
		}
	}
}).
directive('rpsGamesHistory', function(rpsManager){
	return {
		scope: true,
		transclude: false,
		link: function(scope, element, attrs) {
			
			TweenMax.to($('.rps_games_history'), 0.8, {css: {transform: "translateY(0vh)"}, ease:Power2.easeOut});
			scope.gamesHistory = rpsManager.getPlayerGameHistory();
			
			scope.goToMainMenu = function(){
				TweenMax.to($('.rps_games_history'), 0.8, {css: {transform: "translateY(-100vh)"}, ease:Power2.easeOut, onComplete: function(){
					scope.$emit('stateChange', 2);
				}});
			};
			
		}
	}
});