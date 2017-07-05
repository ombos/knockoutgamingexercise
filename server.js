var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var gamesAwaiting = [];
var gamesOnline = [];

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function generateGameId() {
	
	var gameId = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++) {
		gameId += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	
	if (_checkUnique(gameId) == true) {
		return gameId;
	} else {
		generateGameId();
	}

}

function deleteGameId(gameId, type, gamesAwaiting, gamesOnline) {
	
	if (gameId != undefined && type != undefined) {
		if (type == 1) {
			if (gamesAwaiting != undefined) {
				//---
			}
		} else if (type == 2) {
			if (gamesOnline != undefined) {
				//---
			}
		}
	}
	
	return true;
	
}

function _checkUnique(gameId, gamesAwaiting) {
	
	if (gameId != undefined && gameId != '') {
		if (gamesAwaiting != undefined) {
			for (var i = 0; i < gamesAwaiting.length; i++) {
				if (gamesAwaiting[i].gameId == gameId) {
					return false;
				}
			}
		}
		
		return true;
		
	}
}

function _randomIt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _checkStillOnline(gameId) {
	return true;
}


app.all('/game/nick/:nick/item/:item', function (req, res) {
	
	if (gamesAwaiting.length >0) {
		
		var randomKey = _randomIt(0,gamesAwaiting.length-1);
		
		if (_checkStillOnline(gamesAwaiting[randomKey].gameId) == true) {
			var gameToPlay = gamesAwaiting[randomKey];
			console.log('Game random to play: ', gameToPlay);
			res.send(gameToPlay);
		} else {
			//--- 
		}
		
	} else {
		
		var gameCreated = {
			gameId: generateGameId(),
			nick: req.params.nick,
			item: req.params.item
		};
		
		gamesAwaiting.push(gameCreated);
		res.send(gameCreated);
	}
});


var port = process.env.OPENSHIFT_NODEJS_PORT || 8080
, ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
app.listen(port, ip, function() {
  console.log('Server listening on %d', port);
});