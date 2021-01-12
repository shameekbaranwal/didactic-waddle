
//cloud class to make cloud objects from.
class Cloud {

    constructor (x, i) {
        this.cloudsGap = 180;
        this.x = x + i * this.cloudsGap;
        this.y = random(60, 100); //heights of clouds will be random every time. 
        this.h = 64; 
        this.w = 2 * this.h; //\\ these constants w and h control dimensions of cloud image
        this.cloudSpeed = 0;
    }

    show() {
        push();
        fill(255);
        ellipse(this.x + 20, this.y + 20, 60, 60);
        ellipse(this.x - 20, this.y + 20, 60, 60);
        ellipse(this.x - 40, this.y, 60, 60);
        ellipse(this.x, this.y - 15, 60, 50);
        // ellipse(this.x + 15, this.y - 15, 80, 60);
        pop();
    }
}