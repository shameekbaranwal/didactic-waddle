//bird class to make bird objects from.

class Bird {

    constructor (pos) {
        this.centerPos = pos[0]; //the bird is oscillating/waddling about this center with radius r.
        this.x = 0;
        this.y = pos[1];
        this.r = 25; //radius of waddling motion.
        this.w = 60;
        this.h = 20;
        this.speed = 0; //this speed for the screen scrolling
        this.waddlespeed = 3; //this speed for the oscillation about this.centerPos
		this.birdImg;
		this.colour = [random(255), random(255), random(255)];
    }

    show() {
       if (frameCount % 10 === 0) //controlling animation speed
			this.colour = [random(255), random(255), random(255)];
		push();
		fill(200, 100, 100);
		if (this.waddlespeed >= 0) {
			triangle(
				this.centerPos + this.x + 30, this.y, 
				this.centerPos + this.x - 10, this.y + 12,
				this.centerPos + this.x - 10, this.y - 12
				);
		} else {
			triangle(
				this.centerPos + this.x - 30, this.y,
				this.centerPos + this.x, this.y + 12,
				this.centerPos + this.x, this.y - 12
			);
		}
		
		fill(this.colour);
		ellipse(this.centerPos + this.x, this.y, 30, 30);
		pop();
	
	}

    update() { 
        this.x += this.waddlespeed; //for waddling
        if (this.x <= -this.r || this.x >=  this.r) {
            this.waddlespeed *= -1;
        }
    }

    hit(charPos, char) { //importing character position after scrolling separately since it may get lost in translation. 
        if ((char.y - char.h / 2 <= this.y + this.h) && (char.y + char.h / 2 >= this.y - this.h)) {
            if ((charPos - char.w / 2 <= this.centerPos + this.x) && (charPos + char.w / 2 >= this.centerPos + this.x)) {
                return true;
            }
        }
        return false;
    }
}

