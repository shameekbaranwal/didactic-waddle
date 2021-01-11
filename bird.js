
class Bird {

    constructor (pos) {
        this.centerPos = pos[0]; //the bird is oscillating/waddling about this center with radius r.
        this.x = 0;
        this.y = pos[1];
        this.r = 50;
        this.w = 60;
        this.h = 20;
        this.speed = 0; //this speed for the screen scrolling
        this.waddlespeed = 3; //this speed for the oscillation about this.centerPos
        this.birdImg;
    }

    show() {
        imageMode(CENTER);
        if (this.waddlespeed >= 0)
            this.birdImg = birdRightImgs[floor((frameCount / 10) % 2)];
        else
            this.birdImg = birdLeftImgs[floor((frameCount / 10) % 2)];
        image(this.birdImg, this.centerPos + this.x, this.y, this.w, this.h);
    }

    update() { 
        this.centerPos += this.speed; //for scrolling
        this.x += this.waddlespeed; //for waddling
        if (this.x <= -this.r || this.x >=  this.r) {
            this.waddlespeed *= -1;
        }
    }

    hit(char) {
        if ((char.y - char.h / 2 <= this.y + this.h) && (char.y + char.h / 2 >= this.y - this.h)) {
            if ((char.x - char.w / 2 <= this.centerPos + this.x) && (char.x + char.w / 2 >= this.centerPos - this.x)) {
                return true;
            }
        }
        return false;
    }
}