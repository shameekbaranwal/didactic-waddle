/*

didactic-waddle

*/


//author - @shameekbaranwal 


let gameChar_x;
let gameChar_y;
let floorPos_y;
let isLeft;
let isRight;
let charPosition;
let speed;
let char;

let trees_x = []; //array to store tree x positions.
let canyons_x = []; //array to store canyon x positions.
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
let scrollPos; //to store scrolling distance.
let endPos; //to store the ending position, where the mountain will be situated.
let isLaunched; //to store boolean whether game has launched.
let skyColour; //to store sky (and improvised canyon) colour based on current time.
let hr; //will contain the scale by which sky colour will get adjusted.
let isMuted; //will contain boolean whether to play the sound or not.
let charImgsRunning; //array of images for running animation.
let charImgsJumping; //array of images for jumping animation.
let charImgStanding; //array of images for standing character.

function preload() {
	coinSound = loadSound('sfx/coin.wav');
	charImgStanding = loadImage('images/idle.png');
	charImgsRunning = [
		loadImage('images/running/Run (1).png'),
		loadImage('images/running/Run (2).png'),
		loadImage('images/running/Run (3).png'),
		loadImage('images/running/Run (4).png'),
		loadImage('images/running/Run (5).png'),
		loadImage('images/running/Run (6).png'),
		loadImage('images/running/Run (7).png'),
		loadImage('images/running/Run (8).png'),
		loadImage('images/running/Run (9).png'),
		loadImage('images/running/Run (10).png'),
		loadImage('images/running/Run (11).png'),
		loadImage('images/running/Run (12).png'),
		loadImage('images/running/Run (13).png'),
		loadImage('images/running/Run (14).png'),
		loadImage('images/running/Run (15).png'),
	];
	charImgsJumping = [
		loadImage('images/jumping/Jump (1).png'),
		loadImage('images/jumping/Jump (2).png'),
		loadImage('images/jumping/Jump (3).png'),
		loadImage('images/jumping/Jump (4).png'),
		loadImage('images/jumping/Jump (5).png'),
		loadImage('images/jumping/Jump (6).png'),
		loadImage('images/jumping/Jump (7).png'),
		loadImage('images/jumping/Jump (8).png'),
		loadImage('images/jumping/Jump (9).png'),
		loadImage('images/jumping/Jump (10).png'),
		loadImage('images/jumping/Jump (11).png'),
		loadImage('images/jumping/Jump (12).png'),
		loadImage('images/jumping/Jump (13).png'),
		loadImage('images/jumping/Jump (14).png'),
		loadImage('images/jumping/Jump (15).png'),
	];
}

function setup() {
	createCanvas(1024, 576); //1024 x 576, 16:9
	frameRate(60);
	score = 0;
	isLaunched = false;
	hr = (min(hour(), 24 - hour()) + 1) / 12; //the lower this will be, the darker the sky will be
	skyColour = [100 * hr, 155 * hr, 255 * hr];
	isMuted = true;
	setLevel_1();
}


function draw() {

	background(skyColour); // fill the sky

	noStroke();
	fill(0, 155, 0);
	rect(0, floorPos_y, width, height / 4); // draw some green ground

	if (!isLaunched) {
		launchScreen();
	} else {

		scrollPos += speed;

		push();

		translate(scrollPos, 0);

		// Draw clouds.
		for (let i = 0; i < cloudsNum; i++) {
			clouds[i].show();
		}

		//Draw mountains.
		mountainStart.show();
		mountainEnd.show();

		// Draw trees.
		for (let i = 0; i < trees_x.length; i++) {
			trees[i].show();
		}

		// Draw canyons
		for (let i = 0; i < canyons_x.length; i++) {
			canyons[i].show();
		}

		// Draw collectable items
		for (let i = 0; i < coins_Pos.length; i++) {
			if (coins[i] !== undefined) // since we will be devaring coins from array.
			{
				coins[i].show();
				if (coins[i].isFound) { //devaring coin from array to improve efficiency.
					if (!isMuted)
						coinSound.play();
					coins.splice(i, 1);
					score++;
				}
			}
		}

		// Draw birds
		for (let i = 0; i < birds.length; i++) {
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

		if (charPosition >= endPos) //when character will enter mountain.
			youWin();
	}
}


/*

functions defined to do things in a more organised way

*/

function launchScreen() {
	scrollPos -= 0.8;

	stroke(3);
	fill(255);
	textFont('Cascadia');
	textSize(80);
	textAlign(CENTER);
	text("didactic - waddle", width / 2, height / 2 - 50);
	textFont('Monospace');
	textSize(30);
	text("press ENTER to start", width / 2, floorPos_y + 50);
	char.y = floorPos_y;
	char.isJumping = false;

	noStroke();
	push();
	translate(scrollPos, 0);
	for (let i = 0; i < trees_x.length; i++) {
		trees[i].show();
	}

	for (let i = 0; i < cloudsNum; i++) {
		clouds[i].show();
	}
	pop();

	char.show();
	if (-scrollPos >= endPos)
		scrollPos = 0; //in case you don't start the game till you reach the end of arrays.
}

//function to set the environment for level 1. It is seperated out, so more levels can be added
//using the youWin() function, by setting new values for all the variables set here.

function setLevel_1() {
	floorPos_y = height * 3 / 4; //this value will be used throughout the code.
	gameChar_x = 130;
	gameChar_y = floorPos_y;

	//initialising character
	char = new Character(gameChar_x, gameChar_y);

	// Variables to control the background scrolling.
	endPos = 4400;
	scrollPos = 0;
	speed = 0;
	charPosition = char.x; //this variable will contain the distance of the character wrt origin, we use this
	//we use charPosition to keep track of how many pixels character has moved in total.


	// Initialise arrays of scenery objects.

	//mountain
	mountainStart = new Mountain(gameChar_x);
	mountainEnd = new Mountain(endPos);

	//clouds
	cloudsNum = 24;
	for (let i = 0; i < cloudsNum; i++) {
		clouds[i] = new Cloud(100, i); //initializing the cloud objects independent of cloudsNum
	}

	//trees
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

	//canyon
	canyons_x = [
		412,
		1550,
		2400,
		3000
	];

	for (let i = 0; i < canyons_x.length; i++) {
		canyons[i] = new Canyon(canyons_x[i], 200);
	}

	//coins
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
	for (let i = 0; i < coins_Pos.length; i++)
		coins[i] = new Coin(coins_Pos[i]);

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

	for (let i = 0; i < birds_Pos.length; i++)
		birds[i] = new Bird(birds_Pos[i]);
}

//function executes whenever you reach the end mountain.
function youWin() {
	//the character will enter the mountain in this triangle upon winning the game.
	fill(77, 44, 0)
	stroke(0);
	strokeWeight(5);
	triangle(char.x - 80, floorPos_y, char.x + 80, floorPos_y, char.x, floorPos_y - 100);
	noLoop();
	push();
	fill(255);
	strokeWeight(2);
	textSize(40);
	textAlign(CENTER);
	text(
		`CONGRATULATIONS, YOU WIN!
	YOU SCORED ${score} / ${coins_Pos.length} !
	Press R to play again.`, width / 2, height / 2);
	pop();
}

//function executes whenever game ends by falling off or flying away.
function gameOver() {
	noLoop();
	push();
	stroke(0);
	strokeWeight(4);
	translate(-scrollPos, 0);
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

//for motion of character in scene 
function keyPressed() {

	if (key === 'A' || keyCode === 37 && isLaunched) {
		if (!char.isAtLeftEdge()) {
			char.moveLeft();
			char.moveOn = true;
		} else {
			char.moveOn = false;
		}
	}
	
	
	else if (key === 'D' || keyCode === 39 && isLaunched) {
		if (!char.isAtRightEdge()) {
			if (char.isAtLeftEdge)
			char.moveOn = true;
			char.moveRight();
		} else {
			char.moveOn = false;
		}
	}
}

//this function will be executed once when either of these keys are released.
function keyReleased() {
	
	if ((key === 'A' || keyCode === 37) && isLaunched) {
		//all speeds are made 0 when key is released.
		char.xspeed = 0;
		speed = 0;
		char.returnSpeed = 0;
		//this minor offset is included to fix a bug.
		char.x += 5;
		char.moveOn = false;
	}
	
	if ((key === 'D' || keyCode === 39) && isLaunched) {
		//all speeds are made 0 when key is released.
		char.xspeed = 0;
		speed = 0;
		char.returnSpeed = 0;
		//this minor offset is included to fix a bug.
		char.x -= 5;
		char.moveOn = false;
	}

	if (key === 'R' && isLaunched) {
		//to reset the canvas.
		setLevel_1();
		score = 0;
		loop();
	}

	if (!isLaunched && keyCode === 13) {
		char.y = floorPos_y - 200;
		char.isJumping = true;
		isLaunched = true;
		scrollPos = 0;
		textFont('Georgia');
	}

	if (key === 'M') {
		isMuted = !isMuted;
	}
}


//function to check if character is in canyon space and hence, falling.
function isFalling() {
	for (let i = 0; i < canyons_x.length; i++) {
		if (canyons[i].isInCanyon(char.x - scrollPos, char.w)) {
			char.isPlummeting = true;
			return true;
		}
	}
	char.isPlummeting = false;
	return false;
}