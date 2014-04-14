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
	courtTop;

function init(){

		scene = new THREE.Scene();
	 	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	 	
	 	renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild(renderer.domElement);
		
		geometry = new THREE.SphereGeometry( 2, 32, 32 );
		
		material = new THREE.MeshBasicMaterial( { color: 0xBABABA, wireframe: true} );
		material_ball = new THREE.MeshBasicMaterial( { color: 0xCC0000, wireframe: false} );
		
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