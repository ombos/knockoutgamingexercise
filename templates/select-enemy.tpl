<div class="rps_select_enemy" rps-select-enemy>
	<div class="enemies-to-select">
		<h1>Select your enemy:</h1>
		<div class="enemies">
			<div class="enemy" ng-click="selectEnemy('computer')" ng-class="{selected: selectedEnemy=='computer'}">
				<span class="enemy-icon computer"></span>
				<span class="enemy-name">Computer</span>
				<div class="enemy-description">Play with computer, who is always online!</div>
			</div>
			<div class="enemy" ng-click="selectEnemy('player')" ng-class="{selected: selectedEnemy=='player'}">
				<span class="enemy-icon player"></span>
				<span class="enemy-name">Player</span>
				<div class="enemy-description">Play with real enemy, like any other online player or with your friend on this same computer</div>
			</div>
		</div>
	</div>
	
</div>