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
	courtXStart,
	courtXEnd,
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
	xPosOp = 0,
	yPosOp = 0,
	zPosOp = 0,
	frame,
	controller,
	speedArray,
	xSpeed,
	ySpeed,
	zSpeed,
	ballRadius,
	myPlayer = '';
	
	/*Front page animations*/
	
	var modal = document.getElementById('window')
			  , play = document.getElementById('play')
			  , instruct = document.getElementById('instruct');
		modal.setAttribute('class','slidein');
		play.addEventListener('click',prepareStart,false);
		instruct.addEventListener('click',instructions,false);
		
	/*End front page setup*/
	
	/*Front page functions*/
	
	function instructions(e) {
			// show game instructions inside modal window
			var modal = document.getElementById('window')
			  , h2 = document.createElement('h2')
			  , title = document.createTextNode('Instructions')
			  , p = document.createElement('p')
			  , info = document.createTextNode('Use your hand to control the paddle. First person to 21 hits wins!')
			  , button = document.createElement('button')
			  , play = document.createTextNode('Let\'s Play');
			while (modal.firstChild) {
				modal.removeChild(modal.firstChild);
			}
			h2.appendChild(title);
			p.appendChild(info);
			button.appendChild(play);
			button.addEventListener('click',prepareStart,false);
			modal.appendChild(h2);
			modal.appendChild(p);
			modal.appendChild(button);
		}
	function prepareStart(e) {
			var modal = document.getElementById('window');
			e.target.removeEventListener('click',prepareStart,false);
			modal.classList.add('slideout');
			modal.addEventListener('animationend',waiting,false);
			modal.addEventListener('oAnimationEnd',waiting,false);
			modal.addEventListener('webkitAnimationEnd',waiting,false);
		}
		
	function waiting(e) {
		console.log("waiting for more people");
		e.target.parentNode.removeChild(e.target);
		socket.emit('userConnected', { sessionID: myUserID });
	}
		
	function remove() {
				var three = document.createElement('h3')
				  , two = document.createElement('h3')
				  , one = document.createElement('h3');
				three.innerHTML = '3';
				three.setAttribute('class','popin');
				three.addEventListener('animationend',next,false);
				three.addEventListener('oAnimationEnd',next,false);
				three.addEventListener('webkitAnimationEnd',next,false);
				two.innerHTML = '2';
				one.innerHTML = '1';
				document.body.appendChild(three);
				function next(e) {
					three.parentNode.removeChild(three);
					two.setAttribute('class','popin');
					two.addEventListener('animationend',next,false);
					two.addEventListener('oAnimationEnd',next,false);
					two.addEventListener('webkitAnimationEnd',next,false);
					document.body.appendChild(two);
					function next(e) {
						two.parentNode.removeChild(two);
						one.setAttribute('class','popin');
						one.addEventListener('animationend',next,false);
						one.addEventListener('oAnimationEnd',next,false);
						one.addEventListener('webkitAnimationEnd',next,false);
						document.body.appendChild(one);
						function next(e) {
							one.parentNode.removeChild(one);
							
							/*Actually start the game*/
							setInterval(sendData, (1000/15));
							init();
							takeALeap();
							drawCourt();
							addPaddles();
							render();
						}
					}
				}
			}
		
	/*End front page functions*/
	
    socket.on('connect', function () 
    	{
    		myUserID = this.socket.sessionid;
			console.log("my session id: " + myUserID);
    		//socket.emit('userConnected', { sessionID: myUserID });
    		
    	});
		
	function sendData() {
		//console.log("sending data function");
		var coordinates = [];
		
		coordinates.push(xPos);
		coordinates.push(yPos);
		coordinates.push(zPos);
	
		//If user count drops below 2, do not transmit until someone joins again
		if (theUserCount > 1){
			socket.emit('leapData', { id: myClient, coord: coordinates });
			
		}//end of user count > 1
	}
	
	socket.on('userCountUpdate', function (data) 
    	{
    	
    		//console.log("new user count: " + data.count);
			theUserCount = data.count;

    	});
	
	socket.on('sendOutData', function (data) 
    	{
    	
    		console.log("Opponent X: " + data[0]);
			
			xPosOp = data[0];
			yPosOp = data[1];
			zPosOp = data[2];

    	});
			
    socket.on('loginResponse', function (data) 
    	{
    	
			myClient = data.myClientID;
			
			myPlayer = data.player;
			
			console.log("my player is: " + myPlayer);
			
			var userCount = data.userCount;
			
			speedArray = data.speedArray;
			
			xSpeed = speedArray[0];
			ySpeed = speedArray[1];
			zSpeed = speedArray[2];
    		
    	});
		
		socket.on('startGame', function (data) 
    	{
		
			console.log("starting game");
			
			//message = data.response;
			
			remove();
    		
    	});
    	
function takeALeap() {
	
	//console.log("takeALeap");
    	
	controller.on( 'frame' , function( data ){

	      		//console.log("frame");
	      		//Capture data
	      		frame = data;

		  	//Cycle through coordinates of finger tip
		  	if (frame.hands.length > 0){

				var hand = frame.hands[0];

				//console.log("Number of hands: " + frame.hands.length);
				//console.log("Number of fingers: " + frame.fingers.length);

				//Conver tip position to cube position
				xPos = hand.palmPosition[0];
				yPos = hand.palmPosition[1];
				zPos = hand.palmPosition[2];
				
				//console.log(zPos);

				//console.log(yPos);

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
		
		ballRadius = 1.25;
		
		//Lighting for the scene, two lights from different sides
		
		/*
		var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
		directionalLight.position.set(-5, 0, 5);
		scene.add( directionalLight );
	
		var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
		directionalLight2.position.set(5, 0, 5);
		scene.add( directionalLight2 );
		
		var directionalLight3 = new THREE.DirectionalLight( 0xffffff, 0.5 );
		directionalLight3.position.set(0, -5, 50);
		scene.add( directionalLight3 );
		
		var directionalLight4 = new THREE.DirectionalLight( 0xffffff, 0.5 );
		directionalLight4.position.set(0, 5, 50);
		scene.add( directionalLight4 );
		*/
		
		var light = new THREE.PointLight( 0xffffff, 1, 400 );
		light.position.set( 0, 0, 50 );
		scene.add( light );
		
		geometry = new THREE.SphereGeometry( ballRadius, 32, 32 );

		material = new THREE.MeshLambertMaterial( { color: 0xBABABA, wireframe: false} );
		material_ball = new THREE.MeshLambertMaterial( { color: 0xCC0000, wireframe: false} );

		// create the paddle1's material
		var paddle1Material = new THREE.MeshLambertMaterial({color: 0x1B32C0, wireframe: true});
  		// create the paddle2's material
		var paddle2Material = new THREE.MeshLambertMaterial({color: 0x521B6B, wireframe: true});

		paddleWidth = 10;
	 	paddleHeight = 8;
      		paddleDepth = .25;
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

		sphere.position.z = -10;
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

	courtWidth = 50;
	courtXStart = -(courtWidth/2);
	courtXEnd = (courtWidth/2);
	courtDepth = courtWidth * 1.7;
	zPosCourt = 0;
	courtBottom = -12;
	yPosCourt = courtBottom;
	var courtHeight = 24;
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
		var rectMesh = new THREE.Mesh( rectGeom, material );	

		rectMesh.position.set( -(courtWidth/2), yPosCourt, zPosCourt );
		rectMesh.rotation.set( ((2 * Math.PI) * -0.25), 0, 0);

		court.add( rectMesh );
		yPosCourt += courtHeight;
		
	}
	
	for (i=0; i <= 1; i++){
		
		console.log("Create left and right");
		var rectShape = new THREE.Shape();
		rectShape.moveTo( 0,0 );
		rectShape.lineTo( 0, courtDepth );
		rectShape.lineTo( courtHeight, courtDepth );
		rectShape.lineTo( courtHeight, 0 );
		rectShape.lineTo( 0, 0 );
	
		var rectSide = new THREE.ShapeGeometry( rectShape );
		var rectSideMesh = new THREE.Mesh( rectSide, material );
	
		rectSideMesh.position.set( courtXStart, courtBottom, zPosCourt );
		rectSideMesh.rotation.set( ((2 * Math.PI) * -0.25), ((2 * Math.PI) * -0.25), 0);
	
		court.add( rectSideMesh );
		courtXStart += courtWidth;
		
	}

	scene.add( court );

	camera.position.z = 20;
	camera.position.y = 0;
	camera.position.x = 0;
	

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

function render() 

		{

			requestAnimationFrame(render);

			movement();
			movePaddle();

			renderer.render(scene, camera);

		}//end of render

function movement() 
	{

			//console.log("paddle 1 x: " + paddle1.position.x);
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

			if (ball.children[0].position.z  <= (-1 * courtDepth) || ball.children[0].position.z  >= (zPosCourt + 20))
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
			    if (ball.children[0].position.z >= paddle1.position.z - ((paddleDepth/2) - ballRadius)){
			      // and if ball is travelling towards player 
			      if (zSpeed > 0)
			      {
			        currentScore1++;
			        PlaySound('bonk.mp3');
			        matchScoreCheck();
					
					console.log("hit!");
					paddle1.material.color.setHex(0x00ff00);
					var changeColor = setTimeout(function() {restoreColor("paddle1")}, 500);
					
			        // stretch the paddle to indicate 
			        // switch direction of ball travel to create bounce
			        zSpeed *= -1;
			        document.getElementById("player1score").innerHTML = currentScore1;
			        // we impact ball angle when hitting it
			        // this is not realistic physics, just spices up the gameplay
			        // allows you to 'slice' the ball to beat the opponent
			      	}
			      }
			    }
			  }//paddle1 1 end
			  
			  if (ball.children[0].position.x <= paddle2.position.x + paddleWidth
			  &&  ball.children[0].position.x >= paddle2.position.x)
			  {
			    // and if ball is aligned with paddle2 on y plane
			    if (ball.children[0].position.y <= paddle2.position.y + paddleHeight/2
			    &&  ball.children[0].position.y >= paddle2.position.y - paddleHeight/2)
			    {
			    if (ball.children[0].position.z >= paddle2.position.z - ((paddleDepth/2) - ballRadius)){
			      // and if ball is travelling towards player 
			      if (zSpeed > 0)
			      {
			        currentScore2++;
			        PlaySound('bonk.mp3');
			        matchScoreCheck();
					console.log("hit!");
					
					paddle2.material.color.setHex(0x00ff00);
					var changeColor = setTimeout(function() {restoreColor("paddle2")}, 500);
					
			        // stretch the paddle to indicate 
			        // switch direction of ball travel to create bounce
			        zSpeed *= -1;
			        document.getElementById("player2score").innerHTML = currentScore2;
			        // we impact ball angle when hitting it
			        // this is not realistic physics, just spices up the gameplay
			        // allows you to 'slice' the ball to beat the opponent
			      	}
			      }
			    }
			  }//paddle2 end
			  
}//end of movement

function restoreColor(paddle) {
	if (paddle == 'paddle1'){
	paddle1.material.color.setHex( 0x1b32c0 );
	} else {
	paddle2.material.color.setHex( 0x521b6b );
	}
}

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
	
	var vAF = 1.7;
	
	if (myPlayer == 'player1'){
	
		paddle1.position.x = xPos * 0.3;
		paddle1.position.y = (yPos * 0.11) + (courtBottom * vAF);
		paddle1.position.z = (zPos - 100) * 0.1;
		
		paddle2.position.x = xPosOp * 0.3;
		paddle2.position.y = (yPosOp * 0.11) + (courtBottom * vAF);
		paddle2.position.z = (zPosOp - 100) * 0.1;
		
	} else {
		paddle2.position.x = xPos * 0.3;
		paddle2.position.y = (yPos * 0.11) + (courtBottom * vAF);
		paddle2.position.z = (zPos - 100) * 0.1;
		
		paddle1.position.x = xPosOp * 0.3;
		paddle1.position.y = (yPosOp * 0.11) + (courtBottom * vAF);
		paddle1.position.z = (zPosOp - 100) * 0.1;
		
	}
	
}//end move paddle

function PlaySound(path) {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', path);
  audioElement.play();
}

}
