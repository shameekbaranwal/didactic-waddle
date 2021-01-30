//mountain class to make the two mountain objects from.

class Mountain {

    constructor(x) {
        this.x = x;
        this.y = floorPos_y - 150;
        this.leftMostPoint = this.x - 250;
        this.rightMostPoint = this.x + 250
    }
    

    show() {
        push();
        rectMode(CENTER);
        // // hidden - left mountain
        fill(134, 76, 0);
        triangle(this.x + 100, this.y + 150, this.leftMostPoint, this.y + 150, this.x - 50, this.y - 100);
        // // hidden - right mountain
        fill(134, 76, 0);
        triangle(this.rightMostPoint, this.y + 150, this.leftMostPoint, this.y + 150, this.x + 100, this.y - 100);
        // //front - left
        fill(165, 94, 2);
        triangle(this.x + 200, this.y + 150, this.x - 200, this.y + 150, this.x, this.y - 150);
        //front - right
        fill(110, 62, 0);
        triangle(this.rightMostPoint, this.y + 150, this.x + 100, this.y + 150, this.x, this.y - 150);
        pop();
    }

}
