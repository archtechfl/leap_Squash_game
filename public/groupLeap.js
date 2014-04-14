window.onload = function() {
    	var socket = io.connect('142.55.34.84:3700');
    	var userID = 0;
	var myClient = 0;
	var theUserCount = 0;
	
	var scene, 
	camera, 
	renderer, 
	geometry, 
	material, 
	sphere, 
	ball, 
	court, 
	xSpeed, 
	zSpeed, 
	ySpeed, 
	courtWidth, 
	courtDepth, 
	zPosCourt, 
	yPosCourt, 
	courtTop,
	/*Paddle variables*/
	paddleWidth,
	paddleHeight,
	paddleDepth,
	paddleQuality,
	paddle1DirY = 0,
	paddle2DirY = 0,
	paddleSpeed = 3,
	paddle1,
	paddle2,
	score1 = 0,
	score2 = 0,
	maxScore = 21,
	currentScore1 = 0,
	currentScore2 = 0,
	xPos = 0,
	yPos = 0,
	zPos = 0,
	frame,
	controller;
	
    socket.on('connect', function () 
    	{
    		myUserID = this.socket.sessionid;
		console.log("my session id: " + myUserID);
    		socket.emit('userConnected', { sessionID: myUserID });
    		
    	});
		
	function sendData() {
		//console.log("sending data function");
		var coordinates = [];
		
		coordinates.push(xPos);
		coordinates.push(yPos);
		coordinates.push(zPos);
	
		//If user count drops below 2, do not transmit until someone joins again
		if (theUserCount > 1){
			socket.emit('leapData', { id: myUserID, coord: coordinates });
			
		}//end of user count > 1
	}
	
	socket.on('userCountUpdate', function (data) 
    	{
    	
    		//console.log("new user count: " + data.count);
			theUserCount = data.count;

    	});
	
	socket.on('sendOutData', function (data) 
    	{
    	
    		console.log("Data: " + data.id + ' ' + data.coord[0]);

    	});
			
    socket.on('loginResponse', function (data) 
    	{
    	
    	//	console.log("login response: " + data.response);
			myClient = data.myClientID;
			
			var userCount = data.userCount;
			
			//People only start transmitting their info to the server once two players have joined
			if (userCount > 0){
				setInterval(sendData, (1000/15));
				//console.log("Initializing all functions");
				init();
				takeALeap();
				drawCourt();
				addPaddles();
				setSpeed();
				render();
				
			}
    		
    	});
    	
function takeALeap() {
	
	//console.log("takeALeap");
    	
	controller.on( 'frame' , function( data ){
	      
	      		//console.log("frame");
	      		//Capture data
	      		frame = data;
		  
		  	//Cycle through coordinates of finger tip
		  	for(var index = 0; index < frame.pointables.length; index++){
		 
				var pointable = frame.pointables[index];
				
				//console.log("Number of hands: " + frame.hands.length);
				//console.log("Number of fingers: " + frame.fingers.length);
				
				//Conver tip position to cube position
				xPos = pointable.tipPosition[0];
				yPos = pointable.tipPosition[1];
				zPos = pointable.tipPosition[2];
				
				//sendData(xPos,yPos,zPos);
				
				//console.log("x: " + xPos + " y: " + yPos + " z: " + zPos);
	
			  }
	
	    });
	
	controller.connect();

}
    	
function init(){

		//console.log("init");

		scene = new THREE.Scene();
	 	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	 	renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild(renderer.domElement);

		geometry = new THREE.SphereGeometry( 2, 32, 32 );

		material = new THREE.MeshBasicMaterial( { color: 0xBABABA, wireframe: true} );
		material_ball = new THREE.MeshBasicMaterial( { color: 0xCC0000, wireframe: false} );

		// create the paddle1's material
		var paddle1Material = new THREE.MeshBasicMaterial({color: 0x1B32C0, wireframe: false});
  		// create the paddle2's material
		var paddle2Material = new THREE.MeshBasicMaterial({color: 0x521B6B, wireframe: false});

		paddleWidth = 8;
	 	paddleHeight = 5;
      		paddleDepth = 2;
      		paddleQuality = 1;
      		
      		paddle1 = new THREE.Mesh(
		        new THREE.CubeGeometry(
		            paddleWidth,
		            paddleHeight,
		            paddleDepth,
		            paddleQuality,
		            paddleQuality,
		            paddleQuality),
		            paddle1Material
	        );

	        paddle2 = new THREE.Mesh(
		        new THREE.CubeGeometry(
		            paddleWidth,
		            paddleHeight,
		            paddleDepth,
		            paddleQuality,
		            paddleQuality,
		            paddleQuality),
		            paddle2Material
	        );

		sphere = new THREE.Mesh( geometry, material_ball );

		sphere.position.z = -5;
		sphere.position.y = 0;
		sphere.position.x = 0;

		ball = new THREE.Object3D();
		court = new THREE.Object3D();

		ball.add( sphere );

		scene.add(ball);

		/* Leap Initialization */
    
    		//new leap motion controller
    		controller = new Leap.Controller({ enableGestures: true });

	}//end of init

function drawCourt () {

	//console.log("drawCourt");

	courtWidth = 60;
	courtDepth = 150;
	zPosCourt = 0;
	courtBottom = -15;
	yPosCourt = courtBottom;
	var courtHeight = 30;
	courtTop = yPosCourt + courtHeight;

	for (i=0; i <= 1; i++){
		console.log("Create top and bottom");
		var rectShape = new THREE.Shape();
		rectShape.moveTo( 0,0 );
		rectShape.lineTo( 0, courtDepth );
		rectShape.lineTo( courtWidth, courtDepth );
		rectShape.lineTo( courtWidth, 0 );
		rectShape.lineTo( 0, 0 );

		var rectGeom = new THREE.ShapeGeometry( rectShape );
		var rectMesh = new THREE.Mesh( rectGeom, material ) ;	

		rectMesh.position.set( -(courtWidth/2), yPosCourt, zPosCourt );
		rectMesh.rotation.set( ((2 * Math.PI) * -0.25), 0, 0);

		court.add( rectMesh );
		yPosCourt += courtHeight;
	}

	scene.add( court );

	camera.position.z = 20;
	camera.position.y = 0;

	}//end of draw court

function addPaddles() {

	//console.log("addPaddles");

	scene.add(paddle1);
	scene.add(paddle2);

	// set paddles on each side of the table
	paddle1.position.x = -courtWidth/2 + paddleWidth;
        paddle2.position.x = courtWidth/2 - paddleWidth;

       	// lift paddles over playing surface
        paddle1.position.y = courtBottom + paddleHeight;
	paddle2.position.y = courtBottom + paddleHeight;

	paddle1.position.z = zPosCourt - (2 * paddleDepth);
	paddle2.position.z = zPosCourt - paddleDepth;

}//end of add paddles

function setSpeed () {

		//console.log("setSpeed");

		xSpeed = Math.random() * 1;
		zSpeed = 1.3;
		ySpeed = Math.random() * 1;

		console.log("x speed: " + xSpeed + " y speed: " + ySpeed  + " z speed: " + zSpeed);

	}//end of set speed

function render() 

		{

			requestAnimationFrame(render);

			movement();
			movePaddle();

			renderer.render(scene, camera);

		}//end of render

function movement() 
	{

			ball.children[0].position.x += xSpeed;
			ball.children[0].position.y += ySpeed;
			ball.children[0].position.z += zSpeed;

			if (ball.children[0].position.x  >= (courtWidth/2) || ball.children[0].position.x  <= -(courtWidth/2))
				{
					xSpeed *= -1;
				} 

			if (ball.children[0].position.y  >= courtTop || ball.children[0].position.y <= courtBottom)
				{
					ySpeed *= -1;
				} 		

			if (ball.children[0].position.z  <= (-1 * courtDepth) || ball.children[0].position.z  >= zPosCourt)
				{
					zSpeed *= -1;
				} 
			//start AR
			  if (ball.children[0].position.x <= paddle1.position.x + paddleWidth
			  &&  ball.children[0].position.x >= paddle1.position.x)
			  {
			    // and if ball is aligned with paddle1 on y plane
			    if (ball.children[0].position.y <= paddle1.position.y + paddleHeight/2
			    &&  ball.children[0].position.y >= paddle1.position.y - paddleHeight/2)
			    {
			      // and if ball is travelling towards player 
			      if (xSpeed < 0)
			      {
			        currentScore1++;
			        matchScoreCheck();
			        // stretch the paddle to indicate a hit
			        paddle1.color = #27A60E;
			        // switch direction of ball travel to create bounce
			        xSpeed = -xSpeed;
			        // we impact ball angle when hitting it
			        // this is not realistic physics, just spices up the gameplay
			        // allows you to 'slice' the ball to beat the opponent
			        ySpeed -= paddle1DirY * 0.7;
			      }
			    }
			  }//paddle1 1 end
}//end of movement

function matchScoreCheck() {
  if (currentScore1 >= maxScore)
  {
   // stop the ball
    xSpeed = 0;
    zSpeed = 0;
    ySpeed = 0;
    document.getElementById("gameTitle").innerHTML = "Player 1 wins!";
  }
  // else if opponent has 7 points
  else if (currentScore2 >=maxScore)
  {
    // stop the ball
    xSpeed = 0;
    zSpeed = 0;
    ySpeed = 0;

    document.getElementById("gameTitle").innerHTML = "Player 2 wins!";
  }
}
//end AR
	
function movePaddle() {
	
	paddle1.position.x = xPos * 0.1;
	paddle1.position.y = (yPos * 0.05) - 10;
	paddle1.position.z = zPos * 0.01;
	
}//end move paddle

}
