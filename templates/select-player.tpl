<div class="rps_select_player" rps-select-player>
	<div class="players-to-select">
		<h1>Select player:</h1>
		<div class="players">
			<div class="player" ng-click="selectPlayer('local')" ng-class="{selected: selectedPlayer=='local'}">
				<span class="player-icon local"></span>
				<span class="player-name">Local</span>
				<div class="player-description">Play with your friend on this same computer</div>
			</div>
			<div class="player" ng-click="selectPlayer('remote')" ng-class="{selected: selectedplayer=='remote'}">
				<span class="player-icon remote"></span>
				<span class="player-name">Remote</span>
				<div class="player-description">Play remotely with your opponent</div>
			</div>
		</div>
	</div>
	
	<div class="local-play">
		local play
	</div>
	
	<div class="remote-play">
		<h1><i class="fa fa-cog fa-spin fa-3x fa-fw"></i> Waiting for player...</h1>
	</div>
	
	
	
</div>