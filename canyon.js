
class Canyon {

    constructor (x1, w) {
        this.x1 = x1;
        this.w = w;
        this.x2 = x1 + this.w;
        this.speed = 0;
    }

    show() {
        push();
        fill(100, 155, 255);
        rect(this.x1, floorPos_y, this.w, (height - floorPos_y));
        imageMode(CORNER);
        image(canyonleftImg, this.x1, floorPos_y, 50, 144);
        image(canyonRightImg, this.x2 - 50, floorPos_y, 50, 144)
        pop();
    }

    update() {
        this.x1 += this.speed;
        this.x2 = this.x1 + this.w;
    }

    isInCanyon(charX, charW) {
        return ((charX >= this.x1) && (charX + charW / 2 <= this.x2));
    }
}