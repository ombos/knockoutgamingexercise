<div class="rps_game_result" rps-game-result>
	<div class="results-container">
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
	
	<div class="play-again">
		<h1>Select your item:</h1>
		<div class="items">
			<div class="item" ng-click="selectItem('rock')" ng-class="{selected: selectedItem=='rock'}">
				<span class="item-icon rock"></span>
				<span class="item-name">Rock</span>
				<div class="item-description">
					<div class="wins"><i class="fa fa-thumbs-up" aria-hidden="true"></i> Wins with scissors</div>
					<div class="loses"><i class="fa fa-thumbs-down" aria-hidden="true"></i> Loses with paper</div>
				</div>
			</div>
			<div class="item" ng-click="selectItem('paper')" ng-class="{selected: selectedItem=='paper'}">
				<span class="item-icon paper"></span>
				<span class="item-name">Paper</span>
				<div class="item-description">
					<div class="wins"><i class="fa fa-thumbs-up" aria-hidden="true"></i> Wins with rock</div>
					<div class="loses"><i class="fa fa-thumbs-down" aria-hidden="true"></i> Loses with scissors</div>
				</div>
			</div>
			<div class="item" ng-click="selectItem('scissors')" ng-class="{selected: selectedItem=='scissors'}">
				<span class="item-icon scissors"></span>
				<span class="item-name">Scissors</span>
				<div class="item-description">
					<div class="wins"><i class="fa fa-thumbs-up" aria-hidden="true"></i> Wins with paper</div>
					<div class="loses"><i class="fa fa-thumbs-down" aria-hidden="true"></i> Loses with rock</div>
				</div>
			</div>
		</div>
	</div>
	
</div>