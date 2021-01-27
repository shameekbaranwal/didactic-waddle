//tree class to make tree objects from.

class Tree {

    constructor(x, y, i) {
        this.h = 150;
        this.w = this.h;
        this.x = x;
        this.y = y - this.h / 2;
        this.i = i;
        this.treeColour = random (100, 200); //every tree will have a random colour.
    }


    show() {
        push();
        rectMode(CENTER);
        fill(181, 101, 29); //brown for tree trunk
        rect(this.x, this.y + 25, 15, 100);
        fill(140, 70, 29);
        rect(this.x + 7, this.y + 25, 5, 100);
        fill(0, this.treeColour, 0);
        triangle (this.x, this.y + 50, this.x, this.y - 75, this.x - 40, this.y + 50);
        fill(0, this.treeColour - 30, 0);
        triangle (this.x + 40, this.y + 50, this.x, this.y - 75, this.x, this.y + 50);
        fill(0, this.treeColour - 20, 0);
        triangle (this.x + 40, this.y + 50, this.x, this.y - 25, this.x - 40, this.y + 50);
        fill(0, this.treeColour + 20, 0);
        triangle (this.x + 40, this.y + 50, this.x, this.y + 25, this.x - 40, this.y + 50);
        pop();
    }

}
