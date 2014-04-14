//Set up server with express package

var express = require('express');
var app = express();
var port = 3700;

var io = require('socket.io').listen(app.listen(port));

//Sockets.io settings, handles communication between front end and back end

var numUsers = 0;
var clientID = 0;

var userMap = {};

io.sockets.on('connection', function (socket) {

	console.log("Socket: " + socket);

    var address = socket.handshake.address;
    console.log("New connection from " + address.address + " : " + address.port);
    
    socket.on('userConnected', function (data) {
    
		clientID = Math.floor(Math.random() * 1e6);
		socket.clientID = clientID;
		
		//Session ID to client ID mapping
		userMap[clientID] = data.sessionID;
		
		console.log("User map testing: " + userMap[clientID]);
	
    	if (numUsers < 1){
    		io.sockets.emit('loginResponse', {response: "First person joined", map: userMap, myClientID: clientID, userCount: numUsers});
    	} else if (numUsers > 0){
    		io.sockets.emit('loginResponse', {response: "Second person joined", map: userMap, myClientID: clientID, userCount: numUsers});
			console.log("Maximum number of users reached");
    	} else {
    		console.log("Nothing to do");
    	}
		
    	numUsers++;
		io.sockets.emit('userCountUpdate', {count: numUsers});
		
   		console.log("Numbers of users: " + numUsers);
		
    });
	
	socket.on('leapData', function (data) {
	
		console.log("Incoming ID: " + data.id + ' incoming coordinates: ' + data.coord);
	
		//Only transmit when more than one person has joined
		if (numUsers > 1){
			io.sockets.emit('sendOutData', data);
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

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});

 
app.use(express.static(__dirname + '/public')); 

console.log("Listening on port " + port);
