var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var app = express();
var gamesAwaiting = [];
var gamesOnline = [];

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: '34SDgsdgspxxxxxxxdfsG',
    resave: false,
    saveUninitialized: true
}));

module.exports = function (socket) {
	socket.emit('init', {
		test: 'test'
	});

};

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

function _createGame(sessionID, request, gamesAwaiting) {
	
	if (request != undefined) {
		
		var gameCreated = {
			gameId: generateGameId(),
			nick: request.params.nick,
			item: request.params.item,
			sessionID: sessionID
		};
		
		gamesAwaiting.push(gameCreated);
		return gameCreated;
		
	} else return false;
}

function _deleteGame(gameId, gamesAwaiting) {
	console.log('delete game init: '+gameId);
	console.log('games before:', gamesAwaiting);
	if (gameId != undefined) {
		if (gamesAwaiting.length > 0) {

			for (i=0; i<gamesAwaiting.length; i++) {
				
				if (gamesAwaiting[i].gameId == gameId) {
					gamesAwaiting.splice(i, 1);					
					console.log('games after: ', gamesAwaiting);
					return true;
				}
			}
			return false;
		} else return false;
	} else return false;
}

function _checkForWaitingGames(sessionID, request, gamesAwaiting) {
	
	if (sessionID != undefined) {
		console.log('Session ID: '+sessionID);
		if (gamesAwaiting.length > 0) {
			console.log('Games awaiting more than one');
			var randomKey = _randomIt(0, gamesAwaiting.length-1);
			var gameToPlay = gamesAwaiting[randomKey];
			
			console.log('SID: ' +gameToPlay.sessionID+ ' My session:' +sessionID);
			
			if (gameToPlay.sessionID != sessionID) {
				if (_checkStillOnline(gamesAwaiting[randomKey].gameId) == true) {
					return gamesAwaiting[randomKey];
				} else {
					_checkForWaitingGames(sessionID, request, gamesAwaiting);
				}
			} else {
				if (gamesAwaiting.length > 1) {
					_checkForWaitingGames(sessionID, request, gamesAwaiting);
				} else return false;
			}
		} else {
			_createGame(sessionID, request, gamesAwaiting);
			return false;
		}
	} else return false;
	
}


app.all('/game/nick/:nick/item/:item', function (req, res) {
	var sessionID = req.sessionID;
	var gameToPlay = _checkForWaitingGames(sessionID, req, gamesAwaiting);
	module.exports(socket);
	socket.emit('init', {test: 'test'});
	if (gameToPlay) {
		res.send(gameToPlay);
	} else {
		console.log('Currently no games... waiting for players');
	}
	
});

//---@TODO: zamienic to all na get albo post
app.all('/game/deletegame/:gameid', function(req, res){
	if (req.params.gameid) {
		if (_deleteGame(req.params.gameid, gamesAwaiting)) {
			res.send(true);
			console.log(gamesAwaiting);
		} else return false;
	} else return false;
	
})


var port = process.env.OPENSHIFT_NODEJS_PORT || 8080
, ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
app.listen(port, ip, function() {
  console.log('Server listening on %d', port);
});