/*

The Game Project 4 - Side scrolling

Week 6

*/


//\\
//\\I've refactored some things in the code and used more optimised methods, and added 
//\\comments everywhere I felt necessary. 


//\\Changed 'var' to 'let' to prevent bugs

let gameChar_x;
let gameChar_y;
let floorPos_y;
let isLeft;
let isRight;
let charPosition;
let speed;
let char;

let cloudImg; //to store the cloud image.
let treeImg; //to store the tree image.
let coinImgs; //to store the array of six coin images.
let mountainImg; //to store the mountain image.
let charImg; //to store the character images, which will depend on direction of movement.
let charRightImg; //to store the right-facing character image.
let charLeftImg; //to store the left-facing character image.
let canyonleftImg; //for canyon's left side's edge.
let canyonRightImg; //for canyon's right side's edge.
let birdLeftImgs; //for bird facing left side.
let birdRightImgs; //for bird facing right side.
let coinSound; //to store sound upon collecting coins, added p5.sound.js for making it work.
let trees_x = []; //array to store tree x positions.
let canyons_x = [];  //array to store canyon x positions.
let coins_Pos = []; //array to store coins position (x, y).
let birds_Pos = [] //array to store the birds position (x, y).
let clouds = []; //array of instances of Cloud class.
let trees = []; //array of instances of Tree class.
let mountainStart; //mountain where level begins.
let mountainEnd; //mountain where level ends.
let canyons = []; //array of instances of Canyon class.
let coins = []; //array of instances of Coin class.
let birds = []; //array of instances of Bird class.
let cloudsNum; //to store the fixed amount of fixed clouds based on level size.
let score; //to store number of collectibles collected.

function preload() {
	charRightImg = loadImage('images/charRIGHT.png');
	charLeftImg = loadImage('images/charLEFT.png')
	cloudImg = loadImage('images/cloud.png');
	canyonleftImg = loadImage('images/canyon1.png');
	canyonRightImg = loadImage('images/canyon2.png');
	//of the five tree images in the folder, random ones will be picked for each location,
	//we can skip loading any trees from here without changing any remaining code, and it'll work. 
	treeImg = [
		loadImage('images/tree1.png'),
		loadImage('images/tree2.png'),
		loadImage('images/tree3.png'),
		loadImage('images/tree4.png'),
		loadImage('images/tree5.png'),
	];
	//the coin will appear to rotate, so we're rendering it as a fast sequence of 6 images. 
	coinImgs = [
		loadImage('images/coin/1.png'),
		loadImage('images/coin/2.png'),
		loadImage('images/coin/3.png'),
		loadImage('images/coin/4.png'),
		loadImage('images/coin/5.png'),
		loadImage('images/coin/6.png'),
	]
	mountainImg = loadImage('images/mountain.png');
	birdLeftImgs = [
		loadImage('images/birdleft1.png'),
		loadImage('images/birdleft2.png')
	];
	birdRightImgs = [
		loadImage('images/birdright1.png'),
		loadImage('images/birdright2.png')
	];
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
	
	// Draw mountains.
	mountainStart.mountainSpeed = speed;
	mountainStart.update();
	mountainStart.show();
	mountainEnd.mountainSpeed = speed;
	mountainEnd.update();
	 //not drawing the end mountain here since the character will enter it to end level.
	// mountainEnd.show();
	
	noStroke();
	fill(0, 155, 0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
	
	
	push();
	// Draw clouds.
	for (let i = 0; i < cloudsNum; i++) {
		clouds[i].cloudSpeed = speed; //in case scrolling has to occur.
		clouds[i].update();
		clouds[i].show();
	}

	// Draw trees.
	for (let i = 0; i < trees_x.length; i++) {
		trees[i].treeSpeed = speed; //in case scrolling has to occur.
		trees[i].update();
		trees[i].show();
		// console.log('drawing trees');
	}
	// Draw canyons
	for (let i = 0; i < canyons_x.length; i++) {
		canyons[i].speed = speed; //in case scrolling has to occur.
		canyons[i].update();
		canyons[i].show();
	}

	// Draw collectable items
	for (let i = 0; i < coins_Pos.length; i++) {
		if (coins[i] !== undefined) // since we will be deleting coins from array.
		{
			coins[i].speed = speed; //in case scrolling has to occur.
			coins[i].update();
			coins[i].show();
			if (coins[i].isCaught) { //deleting coin from array to improve efficiency.
				coinSound.play();
				coins.splice(i, 1);
				score++;
			}
		}
	}
	pop();

	//Draw birds
	for (let i = 0; i < birds.length; i++) {
		birds[i].speed = speed;
		birds[i].update();
		birds[i].show();
		if (birds[i].hit(char))
			gameOver();
	}
	
	
	
	// Draw the game character - this must be last
	char.show();
	mountainEnd.show(); // mountain is last since the character will appear to enter mountain. 
	
	
	
	//////// Game character logic ///////
	// Logic to move
	
	if (isFalling()) { //logic for character falling in canyon.
		char.acceleration = 0.7;
	}
	
	//to determine position of character in space.
	charPosition -= speed; 

	//updating x values of character according to its xspeed which depends on key pressed.
	//this function will change the char.returnSpeed value in case scrolling is occurring.
	char.updateX();
	 //updating y values of character according to yspeed and acceleration, common for jumping and falling 
	char.updateY();

	//in case the background needs to move in reverse, the char.updateX() function will
	//change the value of char.returnSpeed accordingly, and the environment will 
	//behave according to it. 
	speed = char.returnSpeed;
	if (char.offScreen()) {
		gameOver();
	}

	if (keyIsDown(32))
		char.jump();
		

	showScore();

	if (charPosition >= 3600) //when character will enter mountain.
		youWin();
}

//function to set the environment for level 1. It is seperated out, so more levels can be added
//using the youWin() function, by setting new values for all the variables set here.
function setLevel_1() {
	
	floorPos_y = height * 3 / 4; //this value will be used throughout the code.
	gameChar_x = 130;
	gameChar_y = floorPos_y; 

	//initialising character
	char = new Character(gameChar_x, gameChar_y);
	
	// Variable to control the background scrolling.
	speed = 0;
	charPosition = char.x; //this variable will contain the distance of the character wrt origin, we use this
	//we use charPosition to keep track of how many pixels character has moved in total.
	score = 0;

	// Initialise arrays of scenery objects.
	cloudsNum = 24; 

	//\\clouds
	for (let i = 0; i < cloudsNum; i++) {
		clouds[i] = new Cloud(width / (cloudsNum + 1), i); //\\initializing the cloud objects independent of cloudsNum
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
	for (let i = 0; i < trees_x.length; i++) {
		trees[i] = new Tree(trees_x[i], floorPos_y, i);
	}
	
	//\\mountain
	mountainStart = new Mountain(gameChar_x);
	mountainEnd = new Mountain(4400);

	//\\canyon
	canyons_x = [
		412,
		1550,
		2400,
		3000
	];
	for (let i = 0; i < canyons_x.length; i++) {
		canyons[i] = new Canyon(canyons_x[i], 200);
	}

	//\\coins
	{
	//the coins will be added wrt a coordinate system where origin is at 
	//the left-most point of floor, and y-axis points up. 
	//Every element is a 2D array containing the position
	//as (x, y) with respect to the aforementioned coordinate system.
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
	for (let i = 0; i < coins_Pos.length; i++)
		coins[i] = new Coin (coins_Pos[i]);	

	//birds 
	// birds[0] = new Bird([400, 200]);
	birds_Pos = [
		[300, 250],
		[850, 250],
		[1450, 200],
		[2000, 150],
		[2750, 150],
		[3700, 250],
		[3900, 150]
	];

	for (let i = 0; i < birds_Pos.length; i++)
		birds[i] = new Bird (birds_Pos[i]);
}

//function executes whenever you reach the end mountain.
function youWin() {
	noLoop();
	push();
	fill(0, 155, 0);
	rectMode(CENTER);
	stroke(255);
	strokeWeight(2);
	rect(width/2, height/2 + 35, width, 190);
	fill(255);
	stroke(0, 155, 0);
	textSize(40);
	textAlign(CENTER);
	text(
	`CONGRATULATIONS, YOU WIN!
	YOU SCORED ${score} / 80 !
	Press R to play again.`, width/2, height/2);
	pop();
}

//function executes whenever game ends by falling off or flying away.
function gameOver() {
	noLoop();
	push();
	stroke(255);
	fill(0, 155, 0);
	rectMode(CENTER);
	rect(width/2, height/2 + 20, width, 200);
	textAlign(CENTER);
	fill(0, 0, 155);
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
		}
	}

	if(key === 'D' || keyCode === 39) {
		if (!char.isAtRightEdge()) {
			if (char.isAtLeftEdge)
				char.moveOn = true;
			char.moveRight();
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

/* instead of using translate and push and pop to change the settings every time 
We have made use of an char.returnSpeed property for everything - 
character, clouds, trees, mountains, canyons, etc.
This way of controlling the side scrolling is less complex. 
Basically, if we reach either edge of the screen, we return a reverse speed 
which gets used as the common "speed" for all the environmental entities, so
we immediately appear to move forward without having to translate consistently.
For such small arrays, the optimisation won't make much of a difference,
but if this game were to be scaled up, we could write an algorithm to skip rendering 
entities from the array that are offScreen in an easier way. 
*/

//function to check if character is in canyon space and hence, falling.
function isFalling() {
	for (let i = 0; i < canyons_x.length; i++) {
		if (canyons[i].isInCanyon(char.x, char.w)) {
			char.isFalling = true;
			return true;
		}
	}
	char.isFalling = false;
	return false;
}