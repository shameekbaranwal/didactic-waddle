class Coin {
    constructor(pos) {
        this.x = pos[0];
        this.y = floorPos_y - pos[1];
        this.speed = 0;
        this.coinImg;
        this.size = 30;
        this.isCaught = false;
    }

    show() {
        if (!this.isCaught) {
            imageMode(CENTER);
            this.coinImg = coinImgs[floor((frameCount / 3) % 6)]; //to animate a rotating coin
            image(this.coinImg, this.x, this.y, this.size, this.size);
        }
    }

    hasBeenCaught() {
        if (abs(this.x - char.x) < char.w / 2 - 10) {
            if (abs(this.y - char.y) < char.h / 2 + 20 )
                this.isCaught = true;
        }
    }

    update() {
        this.hasBeenCaught();
        this.x += this.speed;
    }
}