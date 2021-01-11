
class Cloud {

    constructor (x, i) {
        this.x = x;
        this.y = random(60, 160); //heights of clouds will be random every time. 
        this.i = i;
        this.h = 64; 
        this.w = 2 * this.h; //\\ these constants w and h control dimensions of cloud image
        this.cloudsGap = 180;
        this.cloudSpeed = 0;
        charImg = charRightImg;
    }

    show() {
        image(cloudImg, this.x + this.i * this.cloudsGap, this.y, this.w, this.h);
    }

    update() {
        this.x += this.cloudSpeed;
    }


}