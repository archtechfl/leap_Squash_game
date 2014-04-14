window.onload = function() {
    var socket = io.connect('http://localhost:3700');
    var userID = 0;
	var myClient = 0;
	var theUserCount = 0;
	
    socket.on('connect', function () 
    	{
    		myUserID = this.socket.sessionid;
			console.log("my session id: " + myUserID);
    		socket.emit('userConnected', { sessionID: myUserID });
    	});
		
	function sendData() {
	
		var coordinates = [];
	
		var xCoord = 10;
		var yCoord = 10;
		var zCoord = 10;
		
		coordinates.push(xCoord);
		coordinates.push(yCoord);
		coordinates.push(zCoord);
	
		//If user count drops below 2, do not transmit until someone joins again
		if (theUserCount > 1){
			socket.emit('leapData', { id: myUserID, coord: coordinates });
		}
	}
	
	socket.on('userCountUpdate', function (data) 
    	{
    	
    		console.log("new user count: " + data.count);
			theUserCount = data.count;

    	});
	
	socket.on('sendOutData', function (data) 
    	{
    	
    		console.log("Data: " + data.id + ' ' + data.coord[0]);

    	});
			
    socket.on('loginResponse', function (data) 
    	{
    	
    		console.log("login response: " + data.response);
			myClient = data.myClientID;
			
			var userCount = data.userCount;
			
			//People only start transmitting their info to the server once two players have joined
			if (userCount > 0){
				setInterval(sendData, 1000);
			}
    		
    	});

}
