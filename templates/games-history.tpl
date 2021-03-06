<div class="rps_games_history" rps-games-history>
	<div class="games">
		<h1>Your games history: </h1>
		
		<table class="table" ng-if="gamesHistory.length > 0">
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
		
		<p>Wons: <strong>{{stats.wons}} </strong> | Draws: <strong>{{stats.draws}}</strong> | Losts: <strong>{{stats.losts}}</strong></p>
		
		<p ng-if="gamesHistory.length < 1">Currently you didn't play any game...</p>
		
		<button class="btn btn-lg btn-primary" ng-click="goToMainMenu()">Go to main menu</button>
	</div>
</div>