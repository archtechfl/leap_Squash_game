function Canvas3D () {

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
	currentScore = 0;

function init(){

		scene = new THREE.Scene();
	 	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	 	
	 	renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild(renderer.domElement);
		
		geometry = new THREE.SphereGeometry( 2, 32, 32 );
		
		material = new THREE.MeshBasicMaterial( { color: 0xBABABA, wireframe: true} );
		material_ball = new THREE.MeshBasicMaterial( { color: 0xCC0000, wireframe: false} );
		
		// create the paddle1's material
		var paddle1Material = new THREE.MeshLambertMaterial({color: 0x1B32C0;});
  		// create the paddle2's material
		var paddle2Material = new THREE.MeshLambertMaterial({color: 0xFF4045;});
		
		paddleWidth = 10;
	 	paddleHeight = 30;
      		paddleDepth = 10;
      		paddleQuality = 1;
      		
      		paddle1 = new THREE.Mesh(
		        new THREE.CubeGeometry(
		            paddleWidth,
		            paddleHeight,
		            paddleDepth,
		            paddleQuality,
		            paddleQuality,
		            paddleQuality),
		            paddle1Material,
	        );
	
	        paddle2 = new THREE.Mesh(
		        new THREE.CubeGeometry(
		            paddleWidth,
		            paddleHeight,
		            paddleDepth,
		            paddleQuality,
		            paddleQuality,
		            paddleQuality),
		          paddle1Material,
	        );
      		
      		
      		
      		
		
		sphere = new THREE.Mesh( geometry, material_ball );
		
		sphere.position.z = -5;
		sphere.position.y = 0;
		sphere.position.x = 0;
		
		ball = new THREE.Object3D();
		court = new THREE.Object3D();
		
		ball.add( sphere );
	
		scene.add(ball);
		
	}
	
function drawCourt () {

	courtWidth = 65;
	courtDepth = 150;
	zPosCourt = 0;
	courtBottom = -10;
	yPosCourt = courtBottom;
	var courtHeight = 20;
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
		yPosCourt += 20;
	}

	scene.add( court );
	
	camera.position.z = 20;
	camera.position.y = 0;
	
	}
	
function setSpeed () {

		xSpeed = Math.random() * 1;
		zSpeed = 1.3;
		ySpeed = Math.random() * 1;
	
		console.log("x speed: " + xSpeed + " y speed: " + ySpeed  + " z speed: " + zSpeed);
	
	}
	
function render() 
	
		{
		
			requestAnimationFrame(render);
			
			movement();
			
			renderer.render(scene, camera);
			
		}
		
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
		
	}
	
	init();
	drawCourt();
	setSpeed();
	render();
	


}

/*
//global variables
  // paddle variables
  var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
  var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

  // paddle variables
  var paddle1, paddle2;

  // game-related variables
  var score1 = 0, score2 = 0;
  // you can change this to any positive whole number
  var maxScore = 21;

function setup()
{
  // update the board to reflect the max score for match win
  document.getElementById("scoreDiv").innerHTML = "First to " + maxScore + " wins!";

  score1 = 0;
  score2 = 0;

  // set up all the 3D objects in the scene 
  createScene();

  // and let's get cracking!
  draw();
}

function createScene(){
  // create the paddle1's material
  var paddle1Material =
    new THREE.MeshLambertMaterial(
    {
      color: 0x1B32C0;
    });
  // create the paddle2's material
  var paddle2Material =
    new THREE.MeshLambertMaterial(
    {
      color: 0xFF4045;
    });
    // // set up the paddle vars
      paddleWidth = 10;
      paddleHeight = 30;
      paddleDepth = 10;
      paddleQuality = 1;

      paddle1 = new THREE.Mesh(

        new THREE.CubeGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
          paddle1Material,
        );

        paddle2 = new THREE.Mesh(
        new THREE.CubeGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
          paddle1Material,
        );

        // set paddles on each side of the table
        paddle1.position.x = -fieldWidth/2 + paddleWidth;
        paddle2.position.x = fieldWidth/2 - paddleWidth;

        // lift paddles over playing surface
        paddle1.position.z = paddleDepth;
        paddle2.position.z = paddleDepth;



}
function draw (){

    paddlePhysics();
    playerPaddleMovement();

}

function playerPaddleMovement()
{
 //paddle + leap 
}

function paddlePhysics(){
  if (ball.position.x <= paddle1.position.x + paddleWidth
  &&  ball.position.x >= paddle1.position.x)
  {
    // and if ball is aligned with paddle1 on y plane
    if (ball.position.y <= paddle1.position.y + paddleHeight/2
    &&  ball.position.y >= paddle1.position.y - paddleHeight/2)
    {
      // and if ball is travelling towards player (-ve direction)
      if (ballDirX < 0)
      {
        matchScoreCheck();
        // stretch the paddle to indicate a hit
        paddle1.color = #27A60E;
        // switch direction of ball travel to create bounce
        ballDirX = -ballDirX;
        // we impact ball angle when hitting it
        // this is not realistic physics, just spices up the gameplay
        // allows you to 'slice' the ball to beat the opponent
        ballDirY -= paddle1DirY * 0.7;
      }
    }
  }//paddle1 1 end
  //opponent logic (same as above with paddle2 instead of paddle1
  if (ball.position.x <= paddle2.position.x + paddleWidth
  &&  ball.position.x >= paddle2.position.x)
  {
    // and if ball is aligned with paddle1 on y plane
    if (ball.position.y <= paddle2.position.y + paddleHeight/2
    &&  ball.position.y >= paddle2.position.y - paddleHeight/2)
    {
      // and if ball is travelling towards player (-ve direction)
      if (ballDirX < 0)
      {
        matchScoreCheck();
        paddle2.color = #27A60E;
        // switch direction of ball travel to create bounce
        ballDirX = -ballDirX;
      }
    }
  }//paddle2 end
}

function matchScoreCheck() {
  if (score1 >= maxScore)
  {
    // stop the ball
    ballSpeed = 0;
    // write to the score div
    document.getElementById("scores").innerHTML = "Player 1 wins!";
  }
  // else if opponent has 7 points
  else if (score2 >= maxScore)
  {
    // stop the ball
    ballSpeed = 0;

    document.getElementById("scores").innerHTML = "Player 2 wins!";
  }
}
*/
