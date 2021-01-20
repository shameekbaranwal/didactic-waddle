//platform class to make all platform objects from.

class Platform {

    constructor(pos) {
        this.x = pos[0]; //center x of platform
        this.y = pos[1]; //center y 
        this.w = pos[2]; //width
        this.h = 15;
        this.x1 = this.x - this.w / 2; //x of left-most point
        this.x2 = this.x + this.w / 2; //x of right-most point
        this.y1 = this.y - this.h / 2; //y of top-most line
        this.y2 = this.y + this.h / 2; //y of bottom-most line
        this.charOn = false;
    }

    show() {
        // rect(this.x1, this.y1, this.w, this.h);
        fill(200, 0, 0);
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h);
    }

}