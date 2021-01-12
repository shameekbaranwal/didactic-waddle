//coin class to make all coin objects from.

class Coin {
    constructor(pos) {
        this.x = pos[0];
        this.y = floorPos_y - pos[1];
        this.isFound = false;
    }

    show() {
        this.hasBeenCaught();
        if (!this.isFound) {
            let shrink = ((frameCount / 3) % 6); // for rotating animation.
            push();
            shrink = min (shrink, abs(6 - shrink)) / 3;
            // console.log(shrink * 6);
            rectMode(CENTER);
            fill(175, 100, 21); //golden brown
            ellipse(this.x, this.y, 30 * shrink, 30);
            fill(212, 175, 55); //metallic gold
            ellipse(this.x, this.y, 20 * shrink, 20);
            fill(255, 223, 0); //golden yellow
            ellipse(this.x, this.y, 10 * shrink, 10);
            pop();
        }
    }

    hasBeenCaught() {
        if (abs(this.x - charPosition) < char.w / 2 - 10) {
            if (abs(this.y - char.y) < char.h / 2 + 20 )
                this.isFound = true;
        }
    }

}
