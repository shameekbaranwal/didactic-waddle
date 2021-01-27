
function setup() {
	createCanvas(1024, 576); //1024 x 576, 16:9
	frameRate(60);
}

function draw() {
    background(120);
    fill (255);
    ellipse(width / 2, height / 2, 20, 20);
}