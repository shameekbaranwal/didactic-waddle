//

class Mountain {

    constructor(x) {
        this.x = x;
        this.y = floorPos_y;
        this.h = 300;
        this.w = this.h; //\\ these constants w and h control dimensions of mountain image
        this.mountainSpeed = 0;
    }

    show() {
        imageMode(CENTER);
        image(mountainImg, this.x, this.y - this.h / 2, this.w, this.h);
    }

    update() {
        this.x += this.mountainSpeed;
    }

}