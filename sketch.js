/*

The Game Project 4 - Side scrolling

Week 6

*/


//\\
//\\I've refactored some things in the code and used more optimised methods, and added 
//\\comments everywhere I felt necessary. 


var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isRight;
var charPosition;
var speed;
var char;

var cloudImg; //to store the cloud image.
var treeImg; //to store the tree image.
var coinImgs; //to store the array of six coin images.
var mountainImg; //to store the mountain image.
var charImg; //to store the character images, which will depend on direction of movement.
var charRightImg; //to store the right-facing character image.
var charLeftImg; //to store the left-facing character image.
var canyonleftImg; //for canyon's left side's edge.
var canyonRightImg; //for canyon's right side's edge.
var birdLeftImgs; //for bird facing left side.
var birdRightImgs; //for bird facing right side.
var coinSound; //to store sound upon collecting coins, added p5.sound.js for making it work.
var trees_x = []; //array to store tree x positions.
var canyons_x = [];  //array to store canyon x positions.
var coins_Pos = []; //array to store coins position (x, y).
var birds_Pos = [] //array to store the birds position (x, y).
var clouds = []; //array of instances of Cloud class.
var trees = []; //array of instances of Tree class.
var mountainStart; //mountain where level begins.
var mountainEnd; //mountain where level ends.
var canyons = []; //array of instances of Canyon class.
var coins = []; //array of instances of Coin class.
var birds = []; //array of instances of Bird class.
var cloudsNum; //to store the fixed amount of fixed clouds based on level size.
var score; //to store number of collectibles collected.
var scrollPos; //to store scrolling distance.

function preload() {
	coinSound = loadSound('sfx/coin.wav');
}

function setup()
{
	createCanvas(1024, 576); //1024 x 576, 16:9
	frameRate(60);
	
	setLevel_1();
}


function draw()
{
	background(100, 155, 255); // fill the sky blue
	
	noStroke();
	fill(0, 155, 0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
	
	scrollPos += speed;
	
	push();
	
	translate(scrollPos, 0);
	
	//Draw mountains.
	mountainStart.show();
	mountainEnd.show();

	// Draw trees.
	for (var i = 0; i < trees_x.length; i++) {
		trees[i].show();
	}

	// Draw clouds.
	for (var i = 0; i < cloudsNum; i++) {
		clouds[i].show();
	}
	
	// Draw canyons
	for (var i = 0; i < canyons_x.length; i++) {
		canyons[i].show();
	}

	// Draw collectable items
	for (var i = 0; i < coins_Pos.length; i++) {
		if (coins[i] !== undefined) // since we will be devaring coins from array.
		{
			coins[i].show();
			if (coins[i].isFound) { //devaring coin from array to improve efficiency.
				coinSound.play();
				coins.splice(i, 1);
				score++;
			}
		}
	}
	
	// Draw birds
	for (var i = 0; i < birds.length; i++) {
		birds[i].update();
		birds[i].show();
		if (birds[i].hit(charPosition, char))
			gameOver();
	}
	
	if (char.offScreen()) {
		gameOver();
	}

	pop();
	
	
	// Draw the game character - this must be last
	char.show();
	
	
	
	//////// Game character logic ///////
	// Logic to move
	
	if (isFalling()) { //logic for character falling in canyon.
		char.gravity = 0.7;
	}
	
	//to determine position of character in space.
	charPosition = char.x - scrollPos; 

	//updating x values of character according to its xspeed which depends on key pressed.
	//this function will change the char.returnSpeed value in case scrolling is occurring.
	char.updateX();
	 //updating y values of character according to yspeed and acceleration, common for jumping and falling 
	char.updateY();

	//in case the background needs to move in reverse, the char.updateX() function will
	//change the value of char.returnSpeed accordingly, and the environment will 
	//behave according to it. 
	speed = char.returnSpeed;
	

	if (keyIsDown(32))
		char.jump();
		

	showScore();

	if (charPosition >= 4400) //when character will enter mountain.
		youWin();
}


/*

functions defined to do things in a more organised way

*/

//function to set the environment for level 1. It is seperated out, so more levels can be added
//using the youWin() function, by setting new values for all the variables set here.
function setLevel_1() {
	floorPos_y = height * 3 / 4; //this value will be used throughout the code.
	gameChar_x = 130;
	gameChar_y = floorPos_y; 
	
	//initialising character
	char = new Character(gameChar_x, gameChar_y);
	
	// Variables to control the background scrolling.
	scrollPos = 0;
	speed = 0;
	charPosition = char.x; //this variable will contain the distance of the character wrt origin, we use this
	//we use charPosition to keep track of how many pixels character has moved in total.
	
	score = 0;

	// Initialise arrays of scenery objects.
	
	//\\mountain
	mountainStart = new Mountain(gameChar_x);
	mountainEnd = new Mountain(4400);
	
	//\\clouds
	cloudsNum = 24; 
	for (var i = 0; i < cloudsNum; i++) {
		clouds[i] = new Cloud(100, i); //\\initializing the cloud objects independent of cloudsNum
	}
	
	//\\trees
	trees_x = [
		40,
		300,
		700,
		1100,
		1350,
		1850,
		2100,
		2300,
		2700,
		2900,
		3300,
		3500,
		3720,
		3900
	];

	for (var i = 0; i < trees_x.length; i++) {
		trees[i] = new Tree(trees_x[i], floorPos_y, i);
	}

	//\\canyon
	canyons_x = [
		412,
		1550,
		2400,
		3000
	];

	for (var i = 0; i < canyons_x.length; i++) {
		canyons[i] = new Canyon(canyons_x[i], 200);
	}

	//\\coins
	{
	//the coins will be added wrt a coordinate system where origin is at 
	//the left-most point of floor, and y-axis points up. 
	//Every element is a 2D array containing the position
	//as [x, y] coordinates with respect to the aforementioned coordinate system.
	coins_Pos = [
		[200, 30],
		[270, 30],
		[300, 30],
		[330, 30],
		[390, 30],
		//canyon 1 starts
		[420, 70],
		[470, 170],
		[600, 70],
		[512, 200],
		[420, 120],
		[550, 170],
		[600, 120],
		//canyon 1 ends
		//line 1 starts
		[750, 30],
		[750, 70],
		[750, 120],
		[750, 170],
		//line 1 ends
		[800, 30],
		[850, 30],
		[920, 30],
		[1000, 30],
		[1000, 100],
		//line 2 starts
		[1200, 30],
		[1200, 70],
		[1200, 120],
		[1200, 170],
		//line 2 ends
		[1300, 30],
		[1400, 30],
		[1470, 30],
		//canyon 2 starts
		[1575, 30],
		[1605, 50],
		[1635, 80],
		[1665, 50],
		[1710, 30],
		[1575, 100],
		[1605, 150],
		[1635, 200],
		[1665, 150],
		[1710, 100],
		//canyon 2 ends
		[1770, 30],
		[1850, 30],
		[1900, 30],
		[2000, 30],
		[2000, 80],
		//line 3 starts
		[2100, 30],
		[2100, 70],
		[2100, 120],
		[2100, 170],
		//line 3 ends
		[2300, 30],
		[2300, 80],
		//canyon 3 starts
		[2420, 30],
		[2450, 50],
		[2480, 80],
		[2510, 50],
		[2540, 30],
		[2420, 100],
		[2450, 150],
		[2480, 200],
		[2510, 150],
		[2540, 100],
		[2420, 170],
		[2540, 170],
		//canyon 3 ends
		[2700, 30],
		[2800, 30],
		[2800, 80],
		[2900, 30],
		//canyon 4 begins
		[3050, 30],
		[3080, 50],
		[3110, 80],
		[3140, 50],
		[3170, 30],
		//canyon 4 ends
		[3300, 30],
		//line 4 begins
		[3400, 30],
		[3400, 70],
		[3400, 120],
		[3400, 170],
		//line 4 ends
		[3600, 30],
		//line 5 begins
		[3900, 30],
		[3900, 70],
		[3900, 120],
		[3900, 170],
		//line 5 ends
	]
	}
	for (var i = 0; i < coins_Pos.length; i++)
		coins[i] = new Coin (coins_Pos[i]);	

	//birds 
	birds_Pos = [
		[300, 250],
		[850, 250],
		[1450, 200],
		[2000, 150],
		[2750, 150],
		[3700, 250],
		[3900, 150]
	];

	for (var i = 0; i < birds_Pos.length; i++)
		birds[i] = new Bird (birds_Pos[i]);
}

//function executes whenever you reach the end mountain.
function youWin() {
	//the character will enter the mountain in this triangle upon winning the game.
	fill(77, 44, 0)
	stroke(0);
	strokeWeight(1);
	triangle (char.x - 80, floorPos_y, char.x + 80, floorPos_y, char.x, floorPos_y - 100);
	// ellipse(
	noLoop();
	push();
	// fill(0, 155, 0);
	// rectMode(CENTER);
	// stroke(255);
	// strokeWeight(2);
	// rect(width/2, height/2 + 35, width, 190);
	fill(255);
	strokeWeight(4);
	textSize(40);
	textAlign(CENTER);
	text(
	`CONGRATULATIONS, YOU WIN!
	YOU SCORED ${score} / ${coins_Pos.length} !
	Press R to play again.`, width/2, height/2);
	pop();
}

//function executes whenever game ends by falling off or flying away.
function gameOver() {
	noLoop();
	push();
	stroke(0);
	strokeWeight(4);
	translate (-scrollPos, 0);
	// fill(0, 155, 0);
	// rectMode(CENTER);
	// rect(width/2, height/2 + 20, width, 200);
	textAlign(CENTER);
	fill(255);
	textSize(70);
	text(
	`You lost.
	PRESS R TO RESTART!`, width / 2, height / 2);
	pop();
}

function showScore() {
	push();
	textSize(40);
	textAlign(LEFT);
	fill(255);
	stroke(0);
	strokeWeight(2);
	text("SCORE: " + score, 30, 50);
	pop();
}

//\\ for motion of character in scene 
function keyPressed()
{

	if(key === 'A' || keyCode === 37) {
		if (!char.isAtLeftEdge()) {
			char.moveLeft();
		} else {
			scrollPos += 5;
		}
	}


	if(key === 'D' || keyCode === 39) {
		if (!char.isAtRightEdge()) {
			if (char.isAtLeftEdge)
				char.moveOn = true;
			char.moveRight();
		} else {
			scrollPos += 5;
		}
	} 
}

//this function will be executed once when either of these keys are released.
function keyReleased() {
	char.moveOn = false;
	if(key === 'A' || keyCode === 37) {
		//all speeds are made 0 when key is released.
		char.xspeed = 0;
		speed = 0;
		char.returnSpeed = 0;
		//this minor offset is included to fix a bug.
		char.x += 5;
	}
	
	if(key === 'D' || keyCode === 39) {
		//all speeds are made 0 when key is released.
		char.xspeed = 0;
		speed = 0;
		char.returnSpeed = 0;
		//this minor offset is included to fix a bug.
		char.x -= 5;
	}

	if (key === 'R') {
		//to reset the canvas.
		setup();
		loop();
	}
}


//function to check if character is in canyon space and hence, falling.
function isFalling() {
	for (var i = 0; i < canyons_x.length; i++) {
		if (canyons[i].isInCanyon(char.x - scrollPos, char.w)) {
			char.isPlummeting = true;
			return true;
		}
	}
	char.isPlummeting = false;
	return false;
}