//

class Tree {

    constructor(x, y, i) {
        this.x = x;
        this.y = y;
        this.i = i;
        this.h = 150;
        this.w = this.h;
        this.treeSpeed = 0;
        this.treeImage = random(treeImg);
    }


    show() {
        image(this.treeImage, this.x, this.y - this.h / 2, this.w, this.h);
    }

    update() {
        this.x += this.treeSpeed;
    }
}