var express = require('express'),
	io = require('socket.io'),
	http = require('http'),
	app = express(),
	session = require('express-session'),
	server = http.createServer(app),
	io = io.listen(server);

server.listen(3000);	

app.use(express.static(__dirname));

app.use(session({
    secret: '34SDgsdgspxxxxxxxdfsG',
    resave: false,
    saveUninitialized: true
}));

var gamesAwaiting = [];
var getGamesAwaiting = function() {
	return gamesAwaiting;
}

var gamesOnlineCheck = [];
var getGamesOnlineCheck = function() {
	return gamesOnlineCheck;
}

io.on('connection', function(socket) {
	
	socket.emit('setid', socket.id);
	
	socket.on('disconnect', function() {

		var gamesAwaiting = getGamesAwaiting();
		
		if (gamesAwaiting.length >0) {
			for (i=0; i<gamesAwaiting.length; i++) {
				if (gamesAwaiting[i].socketID == socket.id) {
					gamesAwaiting.splice(i, 1);
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

function _checkStillOnline(gameObject, io, player2) {
	
	var gamesOnlineCheck = getGamesOnlineCheck();
	gamesOnlineCheck.push(gameObject.gameId);
	io.sockets.emit('checkonline', {
		gameObject: gameObject,
		player2: player2
	});
}

function _createGame(request) {

	if (request != undefined) {
		
		var gamesAwaiting = getGamesAwaiting();
		var gameCreated = {
			gameId: generateGameId(),
			nick: request.params.nick,
			item: request.params.item,
			sessionID: request.params.sessionid,
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
					
					return true;
				}
			}
			return false;
		} else return false;
	} else return false;
}

function _checkForWaitingGames(request, io) {
	
	var gamesAwaiting = getGamesAwaiting();
	
	if (request.params.sessionid != undefined) {
		if (gamesAwaiting.length > 0) {
			var randomKey = _randomIt(0, gamesAwaiting.length-1);
			var gameToPlay = gamesAwaiting[randomKey];
	
			if (gameToPlay.sessionID != request.params.sessionid) {
				
				_checkStillOnline(gamesAwaiting[randomKey], io, request.params);
				return gamesAwaiting[randomKey];
				
			} else {
				if (gamesAwaiting.length > 1) {
					_checkForWaitingGames(request, io);
				} else return false;
			}
		} else {
			_createGame(request);
			return false;
		}
	} else return false;
}

app.all('/game/getsession', function(req, res){
	var sessionID = req.sessionID;
	res.send({sessionID: sessionID});
});

app.all('/game/nick/:nick/item/:item/sessionid/:sessionid/socketid/:socketid', function (req, res) {
	
	var gameToPlay = _checkForWaitingGames(req, io);
	
	if (gameToPlay) {
		res.send(gameToPlay);
		_deleteGame(gameToPlay.gameId);
	} else {
		res.send(false);
	}
});