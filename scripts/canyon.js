//canyon class to make canyon objects from 

class Canyon {

    constructor (arg) {
        this.x1 = arg[0];
        this.w = arg[1] || 200;
        this.x2 = this.x1 + this.w;
        this.triangleSize = random (10, 40);
    }

    show() {
        push();
        noStroke();
        fill(skyColour);
        rect(this.x1, floorPos_y, this.w, (height - floorPos_y));
        fill(0, 90, 0);
        triangle(this.x1, floorPos_y, this.x1, height, this.x1 + 1.5 * this.triangleSize, height);
        triangle(this.x2, floorPos_y, this.x2, height, this.x2 - 1.5 * this.triangleSize, height);
        fill(0, 155, 0);
        triangle(this.x1, floorPos_y, this.x1, height, this.x1 + this.triangleSize, height);
        triangle(this.x2, floorPos_y, this.x2, height, this.x2 - this.triangleSize, height);
        pop();
    }


    isInCanyon(charX, charW, offset) {
        return ((charX - charW/2 + offset >= this.x1) && (charX + offset <= this.x2)); //the '10' is to make the edges look more realistic 
    }

    inside(x) {
        return ((x <= this.x2 && x >= this.x1));
    }
}
