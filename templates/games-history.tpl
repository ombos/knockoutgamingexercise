<div class="rps_games_history" rps-games-history>
	<div class="games">
		<h1>Your games history: </h1>
		
		<table class="table">
			<thead>
				<th>game id</th>
				<th>item</th>
				<th>enemy</th>
				<th>enemy item</th>
				<th>result</th>
			</thead>
			<tbody>
				<tr ng-repeat="game in gamesHistory">
					<td>{{game.gameId}}</td>
					<td>{{game.player1.item}}</td>
					<td>{{game.player2.player}}</td>
					<td>{{game.player2.status}}</td>
					<td>
						<span class="won" ng-show="game.gameResult == 1">WON</span>
						<span class="lost" ng-show="game.gameResult == 0">LOST</span>
						<span class="draw" ng-show="game.gameResult == -1">DRAW</span>
					</td>
				</tr>
			</tbody>
		</table>
		
		<button class="btn btn-lg btn-primary" ng-click="goToMainMenu()">Go to main menu</button>
	</div>
</div>