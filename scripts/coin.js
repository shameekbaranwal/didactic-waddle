//coin class to make all coin objects from.

class Coin {
    constructor(pos) {
        this.x = pos[0];
        this.y = floorPos_y - pos[1];
        this.isFound = false;
    }

    show() {
        if (!this.isFound) {
            let shrink = ((frameCount / 3) % 6); // for rotating animation.
            push();
            shrink = min(shrink, abs(6 - shrink)) / 3;
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

    hasBeenCaught(charPosition) {
        if (abs(this.x - charPosition) < char.w / 2) {
            if (abs(this.y - (char.y - char.h / 2)) <= char.h / 2) {
                this.isFound = true;
            }
        }
    }

}