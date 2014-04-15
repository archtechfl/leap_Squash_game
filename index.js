//Set up server with express package

var express = require('express');
var app = express();
var port = 3700;

var io = require('socket.io').listen(app.listen(port));

//Sockets.io settings, handles communication between front end and back end

var numUsers = 0;
var clientID = 0;

var userMap = {};
var opponentMap = {};
var keyTemp = [];

var speedArrayServer = [];

var player1;
var player2;

var lastID = 0;

var playerNames = ["player1","player2"];

function setSpeed () {

		//console.log("setSpeed");

		xSpeed = Math.random() * 1;
		zSpeed = 1.1;
		ySpeed = Math.random() * 1;
		
		speedArrayServer.push(xSpeed);
		speedArrayServer.push(ySpeed);
		speedArrayServer.push(zSpeed);

		console.log("x speed: " + xSpeed + " y speed: " + ySpeed  + " z speed: " + zSpeed);

	}//end of set speed
	
setSpeed();

io.sockets.on('connection', function (socket) {
	
		console.log("Socket ID: " + socket.id);
	
		var address = socket.handshake.address;
	    	console.log("New connection from " + address.address + " : " + address.port);
	    
	    	socket.on('userConnected', function (data) {
	    
			clientID = Math.floor(Math.random() * 1e6);
			socket.clientID = clientID;
			
			//Session ID to client ID mapping
			lastID = data.sessionID;
			userMap[clientID] = data.sessionID;
			
			keyTemp = [];
			if (numUsers > 0){
				for (var key in userMap){
					keyTemp.push(key);
					console.log(keyTemp);
				}
				
				opponentMap[keyTemp[0]] = keyTemp[1];
				opponentMap[keyTemp[1]] = keyTemp[0];
				//console.log(keyTemp[1]);
				//console.log(opponentMap[keyTemp[0]]);
				//console.log(keyTemp[0]);
				//console.log(opponentMap[keyTemp[1]]);
				
			}
				
			console.log("User map testing: " + userMap[clientID]);
		
		    		if (numUsers < 1){
		    			io.sockets.emit('loginResponse', {response: "First person joined", map: userMap, myClientID: clientID, userCount: numUsers, speedArray: speedArrayServer, player:playerNames[0]});
		    		} else if (numUsers > 0){
		    			io.sockets.socket(lastID).emit('loginResponse', {response: "Second person joined", map: userMap, myClientID: clientID, userCount: numUsers, speedArray: speedArrayServer, player:playerNames[1]});
						io.sockets.emit('startGame', {response: "Game has begun"});
					console.log("Maximum number of users reached");
		    		} else {
		    			console.log("Nothing to do");
		    		}
			
	    		numUsers++;
			io.sockets.emit('userCountUpdate', {count: numUsers});
			
	   		console.log("Numbers of users: " + numUsers);
			
		});
	
	socket.on('leapData', function (data) {
		
			var dataHolder = {};
			console.log("Incoming ID: " + data.id + ' incoming coordinates: ' + data.coord);
			
			dataHolder[data.id] = data.coord;
			
			/* Debug */
			/*
			for (var key in dataHolder){
				console.log(key);
				console.log("Temp data: " + dataHolder[key]);
			}
			*/
			
			//Only transmit when more than one person has joined
			if (numUsers > 1){
				//io.sockets.emit('sendOutData', data);
				for (var key in opponentMap){
					var ID_OPPOS = opponentMap[data.id];
					destination = userMap[ID_OPPOS];
					io.sockets.socket(destination).emit('sendOutData', dataHolder[data.id]);
				}
			}
			
		});
	
	socket.on('disconnect', function(data) {
		
	        console.log('Someone disconnected!');
		  
		console.log("This person disconnected: " + this.clientID);
		delete userMap[this.clientID];
	
	        numUsers -= 1;
	
		console.log("New number of users: " + numUsers);
		io.sockets.emit('userCountUpdate', {count: numUsers});
		  
		});

});

//Prepare front end template file

/*
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});
*/

 
app.use(express.static(__dirname + '/public')); 

console.log("Listening on port " + port);
