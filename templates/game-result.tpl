<div class="rps_game_result" rps-game-result>
	<h1>Game result: </h1>
	<div class="results">
		<div class="result-element player1">
			<div class="player-details">
				{{playerLastGame.player1.player}} <br/> 
				<span>Player 1</span>
			</div>
			<div class="item">
				<span class="item-icon" ng-class="playerLastGame.player1.item"></span>
				<span class="item-name">{{playerLastGame.player1.item}}</span>
			</div>
		</div>
		
		<div class="result-element score">
			<p class="you-message">You</p>
			<p ng-show="playerLastGame.gameResult == 1" class="message won">WON</p>
			<p ng-show="playerLastGame.gameResult == 0" class="message lost">LOST</p>
			<p ng-show="playerLastGame.gameResult == -1" class="message draw">DRAW</p>
		</div>
		
		<div class="result-element player2">
			<div class="player-details">
				{{playerLastGame.player2.player}} <br/> 
				<span>Player 2</span>
			</div>
			<div class="item">
				<span class="item-icon {{playerLastGame.player2.status}}"></span>
				<span class="item-name">{{playerLastGame.player2.status}}</span>
			</div>
		</div>
		
	</div>
	<div class="navigation">
		<button class="btn btn-lg btn-primary" ng-click="playAgain()">Play again</button>
		<button class="btn btn-lg btn-primary" ng-click="goToMainMenu()">Go to main menu</button>
		<button class="btn btn-lg btn-primary" ng-click="showGameHistory()">Show game history</button>
	</div>
</div>