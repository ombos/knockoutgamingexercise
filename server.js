var express = require('express'),
	io = require('socket.io'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	io = io.listen(server);

server.listen(3000);	

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var gamesAwaiting = [];
var getGamesAwaiting = function() {
	return gamesAwaiting;
}
var gamesOnlineCheck = [];
var getGamesOnline = function() {
	return gamesOnlineCheck;
}
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: '34SDgsdgspxxxxxxxdfsG',
    resave: false,
    saveUninitialized: true
}));

module.exports = function (io) {
	'use strict';
	io.on('connection', function (socket) {
		console.log('connection to the server');
		socket.on('message', function (from, msg) {

			console.log('recieved message from', 
			from, 'msg', JSON.stringify(msg));

			console.log('broadcasting message');
			console.log('payload is', msg);
			io.sockets.emit('broadcast', {
			payload: msg,
			source: from
			});
			console.log('broadcast complete');
		});
		
	});
};

io.on('connection', function(socket) {
	
	console.log('connection to the server');
	
	socket.on('onlinecallback', function (data){
		
		if (data.gameId != undefined) {
			if (gamesOnlineCheck.length > 0) {

				for (i=0; i<gamesOnlineCheck.length; i++) {
					
					if (gamesOnlineCheck[i] == data.gameId) {
						gamesOnlineCheck.splice(i, 1);
					}
				}
			}
		}
	});
	
	socket.on('playersonline', function() {
		console.log('pobieram liste graczy online');
		io.sockets.emit('playerslist', {list: getGamesAwaiting()});
	});
	
	socket.on('disconnected', function() {

		console.log('disconnection from socket');

	});
	
});

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

function _checkStillOnline(gameObject, gamesOnlineCheck, io) {
	
	gamesOnlineCheck.push(gameObject.gameId);
	console.log('Tablice po wpisaniu do sprawdzenia gameid');
	console.log(getGamesOnline());
	io.sockets.emit('checkonline', {
		gameData: gameObject
	});
	
	return true;
	
	setTimeout(function(){

		var toParse = getGamesOnline();
		if (toParse.length > 0) {
			for (i = 0; i< toParse.length-1; i++) {
				if (toParse[i] == gameObject.gameId) {
					return false;
				}
			}
		}
		
		return true;
		
	}, 3000);	
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

	if (gameId != undefined) {
		if (gamesAwaiting.length > 0) {

			for (i=0; i<gamesAwaiting.length; i++) {
				
				if (gamesAwaiting[i].gameId == gameId) {
					gamesAwaiting.splice(i, 1);
					return true;
				}
			}
			return false;
		} else return false;
	} else return false;
}

function _checkForWaitingGames(sessionID, request, gamesAwaiting, gamesOnlineCheck, io) {
	
	if (sessionID != undefined) {
		
		if (gamesAwaiting.length > 0) {
			var randomKey = _randomIt(0, gamesAwaiting.length-1);
			var gameToPlay = gamesAwaiting[randomKey];
	
			if (gameToPlay.sessionID != sessionID) {
				if (_checkStillOnline(gamesAwaiting[randomKey], gamesOnlineCheck, io) == true) {
					console.log('checkstillonline zwraca TRUE');
					console.log(gamesAwaiting[randomKey]);
					return gamesAwaiting[randomKey];
				} else {
					console.log('checkstillonline zwraca FALSE');
					_deleteGame(gameToPlay.gameId, gamesAwaiting);
					_checkForWaitingGames(sessionID, request, gamesAwaiting, gamesOnlineCheck, io);
				}
			} else {
				if (gamesAwaiting.length > 0) {
					_checkForWaitingGames(sessionID, request, gamesAwaiting, gamesOnlineCheck, io);
				} else return false;
			}
		} else {
			_createGame(sessionID, request, gamesAwaiting);
			return false;
		}
	} else return false;
	
}

app.all('/game/getsession', function(req, res){
	var sessionID = req.sessionID;
	res.send({sessionID: sessionID});
});

app.all('/game/nick/:nick/item/:item/sessionid/:sessionid', function (req, res) {
	var sessionID = req.params.sessionid;
	var gameToPlay = _checkForWaitingGames(sessionID, req, gamesAwaiting, gamesOnlineCheck, io);
	
	if (gameToPlay) {
		console.log('Game to play object: ');
		console.log(gameToPlay);
		player2 = {
			gameId: gameToPlay.gameId,
			nick: req.params.nick,
			item: req.params.item,
			sessionid: req.params.sessionid
		};
		
		_deleteGame(gameToPlay.gameId, gamesAwaiting);
		
		io.sockets.emit('broadcast', {
			gameData: gameToPlay,
			player2: player2
		});
		
		res.send(gameToPlay);
		
	} else {
		res.send(false);
		console.log('Currently no games... waiting for players');
	}
	
});