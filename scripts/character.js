//character class to make a character object from.

class Character {

    constructor(x, y) {
        this.x = x;
        this.w = 50; //\\ modify the size of the character here.
        this.h = this.w * 1.5;
        this.y = y - 200; //will be placed 200 pixels higher so character will appear to start game by landing.
        this.xspeed = 0;
        this.yspeed = 0;
        this.moveOn = false;
        this.gravity = 1; //gravity
        this.isJumping = true; //because the character starts off by jumping off the first mountain and landing.
        this.isPlummeting = false;
        this.offSet = 80;
        this.returnSpeed = 0; //\\this value will control the reverse movement of bg items
        this.movingRight = true;
        this.img = charImgStanding;
        this.plat = -1;
        this.flag = false;
    }

    // show() {
    //     push();
    //     rectMode(CENTER);  

    //     //common parts
    //     stroke(0);
    //     strokeWeight(1);
    //     fill(255, 68, 0);
    //     ellipse(this.x, this.y - 70, 20, 20); //head
    //     fill(255, 230, 0);
    //     rect(this.x, this.y - 40, 30, 40); //body
    //     fill(200, 0, 0);
    //     rectMode(CORNER);
    //     if (!this.isJumping) {
    //         //longer legs for walking
    //         rect(this.x - 10, this.y - 20, 5, 20); //left leg
    //         rect(this.x + 5, this.y - 20, 5, 20); //right leg
    //         fill(0, 15, 255);
    //         ellipse(this.x - 7.5, this.y - 2, 8, 6); //left foot
    //         ellipse(this.x + 7.5, this.y - 2, 8, 6); //right foot
    //     } else {
    //         //shorter legs for jumping
    //         rect(this.x - 10, this.y - 20, 5, 5); //left leg
    //         rect(this.x + 5, this.y - 20, 5, 5); //right leg
    //         fill(0, 15, 255);
    //         ellipse(this.x - 7.5, this.y - 12, 8, 6); //left foot
    //         ellipse(this.x + 7.5, this.y - 12, 8, 6); //right foot
    //     }
    //     fill(200, 0, 0);
    //     if (this.movingRight) {
    //         //right facing
    //         rect(this.x + 15, this.y - 50, 20, 5); //arm from behind
    //         rect(this.x, this.y - 40, 30, 5); //arm from front
    //         fill(0, 15, 255);
    //         ellipse(this.x + 35, this.y - 47.5, 8, 8); //hand from behind
    //         ellipse(this.x + 30, this.y - 37.5, 8, 8); //hand from front
    //     } else {
    //         //left facing
    //         rect(this.x - 35, this.y - 50, 20, 5); //arm from behind
    //         rect(this.x - 30, this.y - 40, 30, 5); //arm from front
    //         fill(0, 15, 255);
    //         ellipse(this.x - 35, this.y - 47.5, 8, 8); //hand from behind
    //         ellipse(this.x - 30, this.y - 37.5, 8, 8); //hand from front
    //     }
    //     pop();
    // }

    show() {
        push();
        imageMode(CENTER);

        this.img = charImgStanding; //by default the character is standing
        let i; //variable to control animation.

        translate(this.x, this.y - this.h / 2); //to flip in case of direction change

        if (this.moveOn) { //in case it's running
            i = floor((frameCount / 1.5) % 15);
            this.img = charImgsRunning[i];
        }
        if (this.isJumping) { //in case it's jumping
            i = floor((frameCount / 3) % 15);
            this.img = charImgsJumping[i];
        }

        if (!this.movingRight) //in case running or jumping left 
            scale(-1, 1);

        image(this.img, 0, 0, this.w, this.h);
        pop();
    }

    //for x direction

    isAtRightEdge() {
        return ((this.x + this.w / 2) >= width - this.offSet);
    }

    isAtLeftEdge() {
        return ((this.x - this.w / 2) <= this.offSet);
    }

    isNotAtLeftEnd() {
        return ((charPosition > gameChar_x));
    }

    moveRight() {
        if (this.isAtLeftEdge()) {
            this.x += 10; // this line is to fix a bug when the character stops moving at the edge
        }
        this.xspeed = globalSpeed;
        this.movingRight = true;
    }

    moveLeft() {
        if (this.isAtRightEdge()) {
            this.x -= 10; // this line is to fix a bug when the character stops moving at the edge
        }
        this.xspeed = -globalSpeed;
        this.movingRight = false;
    }

    updateX() {
        if ((this.isAtRightEdge()) && this.moveOn) {
            this.xspeed = 0;
            this.returnSpeed = -globalSpeed;
        } else if (this.isAtLeftEdge() && this.isNotAtLeftEnd() && this.moveOn) {
            this.xspeed = 0;
            this.returnSpeed = globalSpeed;
        }
        this.x += this.xspeed;
    }


    //for y direction

    onGround() {
        if (abs(this.y - floorPos_y) < this.yspeed) {
            this.plat = -1;
            return true;
        } else {
            return false;
        }
    }

    onPlatform(platform) { //function checks if char has climbed/fell on any platform
        return ((abs(this.y - platform.y1) <= this.yspeed) && (this.x - 10 < platform.x2 - scrollPos && this.x + 10 > platform.x1 - scrollPos));
    }

    updateY() {

        /*
        pseudo-code
        if the character is on any platform, then if it is jumping, make it stop jumping and 
        make it stand on that platform
        and if the character is not on any platform AND it's not on the ground AND it wasnt jumping
        (which means it's basically floating in the air), make it fall by mimicing a jump sequence by 
        bringing gravity and by making this.isJumping true till it reaches ground
        */

        if (this.onAnyPlatform(platforms)) {
            if (this.isJumping) {
                this.isJumping = false;
                this.y = platforms[this.plat].y1;
                this.yspeed = 0;
                this.gravity = 0;
            }
        } 
        else if (this.y < floorPos_y ) {
            if (!this.isJumping) {
                this.isJumping = true;
                this.gravity = 0.7;
            }
        } else if (this.y > floorPos_y + 40 && this.isPlummeting) {
            if (this.isJumping) {
                if (this.plat === -1) {
                    if (!this.flag) {
                        this.isJumping = false;
                        this.flag = true;
                    }
                }
            } 
        }


        if (this.onGround()) {
            if (this.isJumping && !this.isPlummeting) {
                this.isJumping = false;
                this.y = floorPos_y;
                this.yspeed = 0;
                this.gravity = 0;
                this.flag = false;
            }
        }

        this.yspeed += this.gravity;
        this.y += this.yspeed;
    }

    onAnyPlatform(platforms) {
        for (let i = 0; i < platforms.length; i++) {
            if (this.onPlatform(platforms[i])) {
                this.plat = i;
                this.flag = false;
                return true;
            }
        }
        return false;
    }

    jump() {
        //so the character can jump only
        //a) when it's not already jumping, or 
        //b) if it was already jumping, then only if that jump was the result of a free fall from ANY platform
        //that second conditional of this.plat and this.onAnyPlatform is true only when it has fallen from a platform
        //and hasn't reached the ground yet.
        if (!this.isJumping || (this.plat !== -1 && !this.onAnyPlatform(platforms))) {
            //so the character can jump only when it's above floor or any platform or in canyon
            if (this.isPlummeting || (this.y - floorPos_y <= this.yspeed) || this.onAnyPlatform(platforms) || this.plat >= 0) {
                this.yspeed = -15;
                this.isJumping = true;
                this.gravity = 0.7;
                this.plat = -1;
            }
        }
    }

    offScreen() {
        return (this.y - this.h >= height);
    }
}