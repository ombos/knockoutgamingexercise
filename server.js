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
var getGamesOnlineCheck = function() {
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

io.on('connection', function(socket) {
	
	console.log('connection to the server');
	
	socket.emit('setid', socket.id);
	
	socket.on('disconnect', function() {
		console.log('Disconnection, deleting game with socket ID: ' + socket.id);
		var gamesAwaiting = getGamesAwaiting();
		
		if (gamesAwaiting.length >0) {
			for (i=0; i<gamesAwaiting.length; i++) {
				if (gamesAwaiting[i].socketID == socket.id) {
					gamesAwaiting.splice(i, 1);
					console.log('Game deleted by socket');
				}
			}
		}
		
	});
	
	socket.on('onlinecallback', function (data){
		
		if (data.gameObject.gameId != undefined) {
				
			var gamesToCheck = getGamesOnlineCheck();
				
			if (gamesToCheck.length > 0) {
				
				for (i=0; i<gamesToCheck.length; i++) {
					
					if (gamesToCheck[i] == data.gameObject.gameId) {
						gamesToCheck.splice(i, 1);
					}
				}
			}	

			player2 = {
				gameId: data.player2.gameId,
				nick: data.player2.nick,
				item: data.player2.item,
				sessionid: data.player2.sessionid
			};

			io.sockets.emit('broadcast', {
				gameData: data.gameObject,
				player2: player2
			});
		}
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

function _sleep(miliseconds) {
  
  var currentTime = new Date().getTime();
  while (currentTime + miliseconds >= new Date().getTime()) {}
  
}

function _checkStillOnline(gameObject, gamesOnlineCheck, io, player2) {
	
	gamesOnlineCheck.push(gameObject.gameId);
	io.sockets.emit('checkonline', {
		gameObject: gameObject,
		player2: player2
	});
}

function _gameOnlineCallback(gameId) {
	
	if (gameId != undefined) {
		var gamesToCheck = getGamesOnlineCheck();
		console.log('Sprawdzenie dla gry: ' + gameId);
		console.log(gamesToCheck);
		for (var i = 0; i < gamesToCheck.length; i++) {
			if (gamesToCheck[i] == gameId) {
				console.error('GAME ID SIE POKRYWA NIE WOLNO TRUE');
				break;
				return false;
			}
		}
		console.log('gra sprawdzona zwrotka true');
		return true;
	}
}

function _createGame(sessionID, request, gamesAwaiting) {
	console.log('Creating game');
	if (request != undefined) {
		
		var gameCreated = {
			gameId: generateGameId(),
			nick: request.params.nick,
			item: request.params.item,
			sessionID: sessionID,
			socketID: request.params.socketid
		};
		
		gamesAwaiting.push(gameCreated);
		return gameCreated;
		
	} else return false;
}

function _deleteGame(gameId) {

	if (gameId != undefined) {
		var gamesAwaiting = getGamesAwaiting();
		if (gamesAwaiting.length > 0) {

			for (i=0; i<gamesAwaiting.length; i++) {
				
				if (gamesAwaiting[i].gameId == gameId) {
					gamesAwaiting.splice(i, 1);
					console.log('Gra ' +gameId+ ' zostala skasowana');
					console.log(gamesAwaiting);
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
				_checkStillOnline(gamesAwaiting[randomKey], gamesOnlineCheck, io, request.params);
				
				if (_gameOnlineCallback(gameToPlay.gameId) == true) {
					return gamesAwaiting[randomKey];
				} else {
					_deleteGame(gameToPlay.gameId);
					_checkForWaitingGames(sessionID, request, gamesAwaiting, gamesOnlineCheck, io);
				}
				
			} else {
				if (gamesAwaiting.length > 1) {
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

app.all('/game/nick/:nick/item/:item/sessionid/:sessionid/socketid/:socketid', function (req, res) {
	var sessionID = req.params.sessionid;
	var gameToPlay = _checkForWaitingGames(sessionID, req, gamesAwaiting, gamesOnlineCheck, io);
	
	if (gameToPlay) {
		console.log('Game to play object: ');
		console.log(gameToPlay);
		res.send(gameToPlay);
		_deleteGame(gameToPlay.gameId);
	} else {
		res.send(false);
		console.log('Currently no games... waiting for players');
	}
	
});