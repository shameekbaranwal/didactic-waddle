class Character {

    constructor(x, y) {
        this.x = x;
        this.h = 80; //\\ modify the size of the character here.
        this.w = this.h //\\ character is in a square box.
        this.y = y - 200; //will be placed 200 pixels higher so character will appear to start game by landing.
        this.xspeed = 0;
        this.yspeed = 0;
        this.moveOn = true;
        this.acceleration = 1;
        this.isJumping = true; //because the character starts off by jumping off the first mountain and landing.
        this.isFalling = false;
        this.offSet = 80;
        this.returnSpeed = 0; //\\this value will control the reverse movement of bg items
        charImg = charRightImg;
    }

    show() {
        imageMode(CENTER);
        image(charImg, this.x, this.y - (this.h / 2), this.w, this.h);
    }

    isAtRightEdge() {
        return ((this.x + this.w / 2) >= width - this.offSet);
    }

    isAtLeftEdge() {
        return ((this.x - this.w / 2) <= this.offSet);
    }

    isNotAtLeftEnd() {
        return ((charPosition > 130));
    }

    moveRight() {
        if (this.isAtLeftEdge()) {
            this.x += 10; //\\ this line is to fix a bug when the character stops moving at the edge
        }
        this.xspeed = 5;
        charImg = charRightImg;
    }

    moveLeft() {
        if (this.isAtRightEdge()) {
            this.x -= 10; //\\ this line is to fix a bug when the character stops moving at the edge
        }
        this.xspeed = -5;
        charImg = charLeftImg;
    }

    updateX() {
        if ((this.isAtRightEdge())) {
            this.xspeed = 0;
            this.returnSpeed = -5;
        } else if (this.isAtLeftEdge() && this.isNotAtLeftEnd()) {
            this.xspeed = 0;
            this.returnSpeed = 5;
        }
        this.x += this.xspeed;
    }

    updateY() {
        if (this.onGround()) {
            if (this.isJumping && !this.isFalling) {
                this.isJumping = false;
                this.y = floorPos_y;
                this.yspeed = 0;
                this.acceleration = 0;
            }
        }
        this.yspeed += this.acceleration;
        this.y += this.yspeed;
    }

    onGround() {
        return (abs(this.y - floorPos_y) < this.yspeed);
    }

    jump() {
        if (!this.isJumping) {
            if (this.isFalling || (this.y - floorPos_y) <= 10) { //so the character can jump only when it's above floor or in canyon
                if (this.yspeed > 0) {
                    this.yspeed = -15;
                    this.isJumping = true;
                }
                this.acceleration = 0.7;
            }
        }
    }

    offScreen() {
        return (this.y - this.h >= height || this.y < 0);
    }
}