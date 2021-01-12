//canyon class to make canyon objects from 

class Canyon {

    constructor (x1, w) {
        this.x1 = x1;
        this.w = w;
        this.x2 = x1 + this.w;
        this.triangleSize = random (10, 40);
    }

    show() {
        push();
        fill(100, 155, 255);
        rect(this.x1, floorPos_y, this.w, (height - floorPos_y));
        fill(0, 90, 0);
        triangle(this.x1, floorPos_y, this.x1, height, this.x1 + 1.5 * this.triangleSize, height);
        triangle(this.x2, floorPos_y, this.x2, height, this.x2 - 1.5 * this.triangleSize, height);
        fill(0, 155, 0);
        triangle(this.x1, floorPos_y, this.x1, height, this.x1 + this.triangleSize, height);
        triangle(this.x2, floorPos_y, this.x2, height, this.x2 - this.triangleSize, height);
        pop();
    }


    isInCanyon(charX, charW) {
        return ((charX >= this.x1) && (charX + charW / 2 <= this.x2));
    }
}
