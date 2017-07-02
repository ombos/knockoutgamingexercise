<div class="rps_game_container" rps-game-container>
	<div class="player player1">
		<div class="status-container">
			<h1>Ready !</h1>
		</div>
		<div class="player-details">
			{{player1.player}} <br/> 
			<span>Player 1</span>
		</div>
		<div class="item">
			<span class="item-icon" ng-class="player1.item"></span>
			<span class="item-name">{{player1.item}}</span>
		</div>
	</div>
	
	<div class="player player2">
		<div class="status-container">
			<h1>Waiting for player...</h1>
		</div>
		<div class="player-details">
			{{player2.player}} <br/> 
			<span>Player 2</span>
		</div>
		<div class="item">
			<span class="item-icon {{player2.status}}"></span>
			<span class="item-name">{{player2.status}}</span>
		</div>
	</div>
</div>