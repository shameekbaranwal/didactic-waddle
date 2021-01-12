//character class to make a character object from.

class Character {

    constructor(x, y) {
        this.x = x;
        this.h = 80; //\\ modify the size of the character here.
        this.w = this.h //\\ character is in a square box.
        this.y = y - 200; //will be placed 200 pixels higher so character will appear to start game by landing.
        this.xspeed = 0;
        this.yspeed = 0;
        this.moveOn = true;
        this.gravity = 1; //gravity
        this.isJumping = true; //because the character starts off by jumping off the first mountain and landing.
        this.isPlummeting = false;
        this.offSet = 80;
        this.returnSpeed = 0; //\\this value will control the reverse movement of bg items
        this.right = true;
    }

    show() {
        push();
        rectMode(CENTER);  

        //common parts
        stroke(0);
        strokeWeight(1);
        fill(255, 68, 0);
        ellipse(this.x, this.y - 70, 20, 20); //head
        fill(255, 230, 0);
        rect(this.x, this.y - 40, 30, 40); //body
        fill(200, 0, 0);
        rectMode(CORNER);
        if (!this.isJumping) {
            //longer legs for walking
            rect(this.x - 10, this.y - 20, 5, 20); //left leg
            rect(this.x + 5, this.y - 20, 5, 20); //right leg
            fill(0, 15, 255);
            ellipse(this.x - 7.5, this.y - 2, 8, 6); //left foot
            ellipse(this.x + 7.5, this.y - 2, 8, 6); //right foot
        } else {
            //shorter legs for jumping
            rect(this.x - 10, this.y - 20, 5, 5); //left leg
            rect(this.x + 5, this.y - 20, 5, 5); //right leg
            fill(0, 15, 255);
            ellipse(this.x - 7.5, this.y - 12, 8, 6); //left foot
            ellipse(this.x + 7.5, this.y - 12, 8, 6); //right foot
        }
        fill(200, 0, 0);
        if (this.right) {
            //right facing
            rect(this.x + 15, this.y - 50, 20, 5); //arm from behind
            rect(this.x, this.y - 40, 30, 5); //arm from front
            fill(0, 15, 255);
            ellipse(this.x + 35, this.y - 47.5, 8, 8); //hand from behind
            ellipse(this.x + 30, this.y - 37.5, 8, 8); //hand from front
        } else {
            //left facing
            rect(this.x - 35, this.y - 50, 20, 5); //arm from behind
            rect(this.x - 30, this.y - 40, 30, 5); //arm from front
            fill(0, 15, 255);
            ellipse(this.x - 35, this.y - 47.5, 8, 8); //hand from behind
            ellipse(this.x - 30, this.y - 37.5, 8, 8); //hand from front
        }
        pop();
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
        this.right = true;
    }

    moveLeft() {
        if (this.isAtRightEdge()) {
            this.x -= 10; //\\ this line is to fix a bug when the character stops moving at the edge
        }
        this.xspeed = -5;
        this.right = false;
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
            if (this.isJumping && !this.isPlummeting) {
                this.isJumping = false;
                this.y = floorPos_y;
                this.yspeed = 0;
                this.gravity = 0;
            }
        }
        this.yspeed += this.gravity;
        this.y += this.yspeed;
    }

    onGround() {
        return (abs(this.y - floorPos_y) < this.yspeed);
    }

    jump() {
        if (!this.isJumping) {
            if (this.isPlummeting || (this.y - floorPos_y) <= 10) { //so the character can jump only when it's above floor or in canyon
                this.yspeed = -15;
                this.isJumping = true;
                this.gravity = 0.7;
            }
        }
    }

    offScreen() {
        return (this.y - this.h >= height);
    }
}
