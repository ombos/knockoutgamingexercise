<div class="rps_select_item" rps-select-item>
	<div class="player-nick">
		<input type="text"  placeholder="Please, type your nick" ng-model="playerName" ng-class="{inputError: inputError}" ng-keydown="$event.keyCode === 13 && savePlayerNick()" autofocus /> <br/>
		<button class="btn btn-lg btn-primary"  ng-click="savePlayerNick()">Let's play !</button>
	</div>
	
	<div class="items-to-select">
	
		<h1>Select your item:</h1>
		<div class="items">
			<div class="item" ng-click="selectItem('rock')" ng-class="{selected: selectedItem=='rock'}">
				<span class="item-icon rock"></span>
				<span class="item-name">Rock</span>
				<div class="item-description">test test test</div>
			</div>
			<div class="item" ng-click="selectItem('paper')" ng-class="{selected: selectedItem=='paper'}">
				<span class="item-icon paper"></span>
				<span class="item-name">Paper</span>
				<div class="item-description">test test test</div>
			</div>
			<div class="item" ng-click="selectItem('scissors')" ng-class="{selected: selectedItem=='scissors'}">
				<span class="item-icon scissors"></span>
				<span class="item-name">Scissors</span>
				<div class="item-description">test test test</div>
			</div>
		</div>
	</div>
	
</div>