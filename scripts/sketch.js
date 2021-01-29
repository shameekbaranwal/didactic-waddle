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
let canv;
const globalSpeed = 5;

let currentLevel;
let level1;
let trees_x = []; //array to store tree x positions.
let canyons_x = []; //array to store canyon x positions.
let coins_Pos = []; //array to store coins position (x, y).
let birds_Pos = [] //array to store the birds position (x, y).
let platforms_Pos = []; //array to store platforms' chaaracteristics (x, y, w);
let clouds = []; //array of instances of Cloud class.
let trees = []; //array of instances of Tree class.
let mountainStart; //mountain where level begins.
let mountainEnd; //mountain where level ends.
let canyons = []; //array of instances of Canyon class.
let coins = []; //array of instances of Coin class.
let birds = []; //array of instances of Bird class.
let platforms = []; //array of instances of Platform class.
let cloudsNum; //to store the fixed amount of fixed clouds based on level size.
let score; //to store number of collectibles collected.
let scrollPos; //to store scrolling distance.
let endPos; //to store the ending position, where the mountain will be situated.
let skyColour; //to store sky (and improvised canyon) colour based on current time.
let hr; //will contain the scale by which sky colour will get adjusted.
let isMuted; //will contain boolean whether to play the sound or not.
let charImgsRunning; //array of images for running animation.
let charImgsJumping; //array of images for jumping animation.
let charImgStanding; //array of images for standing character.
let generateButton; //button to redirect to level creating page.
let isLaunched; //to store boolean whether game has launched.
let mode; //alternative to boolean for controlling screen. Legend below.
/*
	-1: launch screen, equiv to isLaunched = false.
	0: splash screen, ENTER to continue, button click to go to generate.html, drag/drop to play THAT level
	1: game
	2: levelCompleted
	3: levelLost
*/

function preload() {
	level1 = loadJSON('config/level-1.json');
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
	canv = createCanvas(1024, 576); //1024 x 576, 16:9
	frameRate(60);
	// generateButton = createButton();
	score = 0;
	isLaunched = false;
	mode = -1;
	hr = (min(hour(), 24 - hour()) + 1) / 12; //the lower this will be, the darker the sky will be
	hr = (hr > 1) ? 1 : hr;
	skyColour = [90 * hr, 145 * hr, 245 * hr];
	isMuted = false;
	currentLevel = level1;
	setLevel(currentLevel);
}


function draw() {

	background(skyColour); // fill the sky

	noStroke();
	fill(0, 155, 0);
	rect(0, floorPos_y, width, height / 4); // draw some green ground


	// 	launch screen
	if (mode === -1) {
		launchScreen();
	}

	// option screen
	else if (mode === 0) {
		splashScreen();
	} else if (mode === 0.5) {
		stroke(0);
		strokeWeight(2);
		textSize(50);
		fill(255);
		text(`Level loaded.`, width / 2, 200);
		textSize(20);
		strokeWeight(0.5);
		text(`press ENTER to start playing`, width / 2, floorPos_y + 50);
	}


	//actual game
	else if (mode === 1) {

		scrollPos -= speed;

		push();

		translate(-scrollPos, 0);

		// Draw clouds.
		for (let i = 0; i < cloudsNum; i++) {
			///////////
			if (onScreen(clouds[i], 'x', 100))
				clouds[i].show();
		}

		//Draw mountains.
		mountainStart.show();
		mountainEnd.show();

		// Draw trees.
		for (let i = 0; i < trees_x.length; i++) {
			if (onScreen(trees[i], 'x', 100))
				trees[i].show();
		}

		// Draw canyons
		for (let i = 0; i < canyons_x.length; i++) {
			if (onScreen(canyons[i], 'x1', 100) || onScreen(canyons[i], 'x2', 100))
				canyons[i].show();
		}

		// Draw coins
		for (let i = 0; i < coins_Pos.length; i++) {
			if (coins[i] !== undefined) // since we will be devaring coins from array.
			{
				if (onScreen(coins[i], 'x', 20)) {
					coins[i].hasBeenCaught(charPosition);
					coins[i].show();
					if (coins[i].isFound) { //devaring coin from array to improve efficiency.
						if (!isMuted)
							coinSound.play();
						coins.splice(i, 1);
						score++;
					}
				}
			}
		}

		// Draw platforms
		for (let i = 0; i < platforms_Pos.length; i++) {
			platforms[i].show();
		}

		// Draw birds
		for (let i = 0; i < birds.length; i++) {
			if (onScreen(birds[i], 'centerPos', 40)) {
				birds[i].update();
				birds[i].show();
				if (birds[i].hit(charPosition, char))
					gameOver();
			}
		}


		if (char.offScreen()) {
			gameOver();
		}

		//////// Game character logic ///////
		// Logic to move

		if (isFalling()) { //logic for character falling in canyon.
			char.gravity = 0.7;
		}

		pop();


		// Draw the game character - this must be last
		char.show();




		//to determine position of character in space.
		charPosition = char.x + scrollPos;

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

	drawMuteButton();
}


/*

functions defined to do things in a more organised way

*/

function launchScreen() {
	scrollPos += 0.8;

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
	translate(-scrollPos, 0);
	for (let i = 0; i < trees_x.length; i++) {
		trees[i].show();
	}

	for (let i = 0; i < cloudsNum; i++) {
		clouds[i].show();
	}
	pop();

	char.show();
	if (scrollPos >= endPos)
		scrollPos = -width; //in case you don't start the game till you reach the end of arrays.
}

//function to set the environment for level 1. It is seperated out, so more levels can be added
//using the youWin() function, by setting new values for all the variables set here.

function setLevel(level) {
	floorPos_y = height * 3 / 4; //this value will be used throughout the code.
	gameChar_x = 130;
	gameChar_y = floorPos_y;

	//initialising character
	char = null;
	char = new Character(gameChar_x, gameChar_y);

	// Variables to control the background scrolling.
	endPos = null;
	endPos = level.size;
	scrollPos = 0;
	speed = 0;
	charPosition = char.x; //this variable will contain the distance of the character wrt origin, we use this
	//we use charPosition to keep track of how many pixels character has moved in total.


	// Initialise arrays of scenery objects.

	//platforms
	// arrayCopy(level['platforms_Pos'], platforms_Pos, level['platforms_Pos'].length);
	platforms_Pos = [];
	platforms = [];
	platforms_Pos = level.platforms_Pos;

	for (let i = 0; i < platforms_Pos.length; i++) {
		platforms[i] = new Platform(platforms_Pos[i]);
	}

	//mountain
	mountainStart = new Mountain(gameChar_x);
	mountainEnd = new Mountain(endPos);

	//clouds
	cloudsNum = 24;
	for (let i = 0; i < cloudsNum; i++) {
		clouds[i] = new Cloud(i); //initializing the cloud objects independent of cloudsNum
	}

	//trees
	// arrayCopy(level['trees_x'], trees_x, level['trees_x'].length);
	trees = [];
	trees_x = [];
	trees_x = level.trees_x;

	for (let i = 0; i < trees_x.length; i++) {
		trees[i] = new Tree(trees_x[i]);
	}

	//canyon
	// arrayCopy(level['canyons_x'], canyons_x, level['canyons_x'].length);
	canyons = [];
	canyons_x = [];
	canyons_x = level.canyons_x;

	for (let i = 0; i < canyons_x.length; i++) {
		canyons[i] = new Canyon(canyons_x[i]);
	}

	//coins
	// arrayCopy(level['coins_Pos'], coins_Pos, level['coins_Pos'].length);
	coins = [];
	coins_Pos = [];
	coins_Pos = level.coins_Pos;

	for (let i = 0; i < coins_Pos.length; i++) {
		coins[i] = new Coin(coins_Pos[i]);
	}

	//birds 
	// arrayCopy(level['birds_Pos'], birds_Pos, level['birds_Pos'].length);
	birds = [];
	birds_Pos = [];
	birds_Pos = level.birds_Pos;

	for (let i = 0; i < birds_Pos.length; i++) {
		birds[i] = new Bird(birds_Pos[i]);
	}
}

//function executes whenever you reach the end mountain.
function youWin() {
	//the character will enter the mountain in this triangle upon winning the game.
	noLoop();
	fill(77, 44, 0)
	stroke(0);
	strokeWeight(1);
	triangle(char.x - 80, floorPos_y, char.x + 80, floorPos_y, char.x, floorPos_y - 100);
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
	translate(scrollPos, 0);
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

	if ((key === 'A' || keyCode === 37 || key === 'a') && mode > 0) {
		if (!char.isAtLeftEdge()) {
			char.moveLeft();
			char.moveOn = true;
		} else {
			char.moveOn = false;
		}
	} else
	if ((key === 'D' || keyCode === 39 || key === 'd') && mode > 0) {
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

	if ((key === 'A' || keyCode === 37 || key === 'a') && mode > 0) {
		//all speeds are made 0 when key is released.
		char.xspeed = 0;
		speed = 0;
		char.returnSpeed = 0;
		//this minor offset is included to fix a bug.
		char.x += globalSpeed;
		char.moveOn = false;
	}

	if ((key === 'D' || keyCode === 39 || key === 'd') && mode > 0) {
		//all speeds are made 0 when key is released.
		char.xspeed = 0;
		speed = 0;
		char.returnSpeed = 0;
		//this minor offset is included to fix a bug.
		char.x -= globalSpeed;
		char.moveOn = false;
	}

	if ((key === 'R' || key === 'r') && mode > 0) {
		//to reset the canvas.
		setLevel(currentLevel);
		score = 0;
		loop();
	}

	if (keyCode === 13) {
		if (mode === -1) {
			mode++;
			generateButton = createButton('Go to level generator');
			generateButton.position(width / 2 - 50, height / 2 - 25);
			generateButton.size(100, 50);
			generateButton.mousePressed(() => {
				window.location = '/generate.html';
			})

			canv.drop((file) => {
				customLevel = file.data;
				let f;
				f = verifyLevel(customLevel);
				if (f) {
					mode += 0.5;
					currentLevel = customLevel;
					setLevel(currentLevel);
					generateButton.hide();
					char.y = floorPos_y - 200;
					char.isJumping = true;
					isLaunched = true;
					scrollPos = 0;
					textFont('Georgia');
				} else {
					alert("Invalid file.");
				}
			});
		} else if (mode === 0.5) {
			mode = 1;
			canv.drop((file) => {});
		} else if (mode === 0) {
			mode++;
			generateButton.hide();
			char.y = floorPos_y - 200;
			char.isJumping = true;
			isLaunched = true;
			scrollPos = 0;
			textFont('Georgia');
		}
	}

	if (key === 'M' || key === 'm') {
		isMuted = !isMuted;
	}
}

//function to check if character is in canyon space and hence, falling.
function isFalling() {
	for (let i = 0; i < canyons_x.length; i++) {
		if (canyons[i].isInCanyon(char.x + scrollPos, char.w, 10)) {
			if (!char.onAnyPlatform(platforms)) {
				char.isPlummeting = true;
				return true;
			}
		}
	}
	char.isPlummeting = false;
	return false;
}

function drawMuteButton() {
	noStroke();
	if (isMuted)
		fill(255, 0, 0)
	else
		fill(255);
	rect(width - 60, height - 60, 20, 20);
	triangle(width - 50, height - 50, width - 20, height - 80, width - 20, height - 20);
}

function mousePressed() {
	if (mouseX >= width - 60 && mouseX <= width && mouseY <= height && mouseY >= height - 80)
		isMuted = !isMuted;
}

function onScreen(thing, loc, offset) {
	return (thing[loc] > scrollPos - offset && thing[loc] < (scrollPos + width + offset));
}

function splashScreen() {
	// generateButton = createButton('Go to level generator');
	stroke(0);
	strokeWeight(2);
	textSize(20);
	fill(255);
	textAlign(CENTER);
	text(`You can drag and drop a custom level JSON file
which you can create on the level generator engine
available here :`, width / 2, 200);

	noStroke();
	text(`or you can press ENTER to continue with preset levels`, width / 2, floorPos_y + 50);
}

function verifyLevel(file) {
	return (
		file.size &&
		file.platforms_Pos &&
		file.trees_x &&
		file.birds_Pos &&
		file.canyons_x &&
		file.platforms_Pos &&
		file.coins_Pos
	)
}