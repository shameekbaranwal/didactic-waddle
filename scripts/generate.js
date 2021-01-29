let size;
let trees_x;
let trees;
let canyons_x;
let canyons;
let clouds;
let mountainStart;
let mountainEnd;
let coins_Pos;
let coins;
let birds_Pos;
let birds;
let platforms_Pos;
let platforms;
let scroll;
let floorPos_y;
let skyColour;
let inputField;
let fieldButton;
let scrollLeftButton;
let scrollRightButton;
let flag;
let groundDraw;
let temp;
let scrollPos;
const scrollSpeed = 5;
let x1;
let y1;
let moveLeft;
let moveRight;
let mode;
/*
the process is divided into several stages, denoted by the value of mode.
mode = -1 => launch screen.
mode = 0 => awaiting input for level size.
mode = 1 => awaiting canyon inputs.
mode = 2 => awaiting tree inputs.
mode = 3 => awaiting platform inputs.
mode = 4 => awaiting coin inputs.
mode = 5 => awaiting bird inputs.
mode = 6 => confirmation.
mode = 7 => save JSON file.
*/


function setup() {
    createCanvas(1024, 576); //1024 x 576, 16:9
    frameRate(60);
    initialization();
}

function draw() {
    background(skyColour);
    //ground
    if (mode > 0) {
        noStroke();
        fill(0, 155, 0);
        rect(0, floorPos_y, width, height / 4); // draw some green ground
    }

    push();
    translate(-scrollPos, 0);
    //clouds
    for (let i = 0; i < clouds.length; i++) {
        clouds[i].show();
    }
    //mountains
    if (mountainStart)
        mountainStart.show();
    if (mountainEnd)
        mountainEnd.show();
    //trees
    for (let i = 0; i < trees.length; i++) {
        trees[i].show();
    }
    //canyons
    for (let i = 0; i < canyons.length; i++) {
        canyons[i].show();
    }
    //coins
    for (let i = 0; i < coins.length; i++) {
        coins[i].show();
    }
    //platforms
    for (let i = 0; i < platforms.length; i++) {
        platforms[i].show();
    }
    //birds
    for (let i = 0; i < birds.length; i++) {
        birds[i].update();
        birds[i].show();
    }
    pop();


    //launch screen mode
    if (mode === -1) { //launch screen.
        stroke(3);
        fill(255);
        textFont('Cascadia');
        textSize(80);
        textAlign(CENTER);
        text(`didactic - waddle
level generator`, width / 2, height / 2 - 50);
        textFont('Monospace');
        textSize(30);
        text("press ENTER to start", width / 2, floorPos_y + 50);
    }




    //entering game size mode
    else if (mode === 0) {
        if (!inputField) {
            // inputField = createInput("Enter a valid size for level (2000 - 20000)");
            inputField = createInput("2001");
            inputField.position(width / 2 - 125, height / 2);
            inputField.size(250, 40);
            fieldButton = createButton('submit');
            fieldButton.position(width / 2 + 125, height / 2);
            fieldButton.size(80, 45);
            flag = false;
        }
        fieldButton.mousePressed(() => {
            temp = int(inputField.value());
        });
        showInstruction('Enter a valid size for the level (between 2000-20000)')
        if (temp != undefined && temp !== NaN) {
            if (temp >= 2000 && temp <= 20000) {
                zeroToOne();
            } else {
                temp = undefined;
                alert('Incompatible value. Try again.');
            }
        }
    }




    //drawing canyons mode
    else if (mode === 1) {
        // console.log(flag);
        if (flag) {
            push();
            fill(200, 0, 0);
            rect(x1, floorPos_y, mouseX - x1, height - floorPos_y);
            pop();
            showInstruction('Click again to finish drawing the canyon.');
        } else {
            showInstruction(`Click anywhere to start drawing a canyon

or press ENTER to continue.`);
        }
    }



    //drawing trees mode
    else if (mode === 2) {
        showInstruction(`Click anywhere to place a tree on the ground

or press ENTER to continue.`);
    }




    //drawing platforms mode
    else if (mode === 3) {
        if (flag) {
            fill(200, 0, 0);
            rect(x1, y1, mouseX - x1, 15);
            showInstruction(`Click anywhere to finish drawing this platform.`);
        } else {
            showInstruction(`Click anywhere to start drawing a platform

or press ENTER to continue.`);
        }
    }




    //drawing coins mode
    else if (mode === 4) {
        showInstruction(`Click anywhere to add an animated collectable
        
or press ENTER to continue.`);
    }




    //drawing bird mode
    else if (mode === 5) {
        showInstruction(`Click anywhere to add a waddling bird
        
or press ENTER to continue.`);
    }


    //confirmation
    else if (mode === 6) {
        showInstruction(`Press ENTER to confirm selections.`);
    }

    else if (mode === 7) {
        showInstruction(`Now download the ejected JSON file, 
and drag and drop it on the game, available here.`);
        fieldButton = createButton('didactic-waddle');
        fieldButton.mousePressed(() => {
            window.location = '/';
        });
        noLoop();
    }


    if (moveLeft)
        scrLeft();
    else if (moveRight)
        scrRight();


}

function initialization() {
    floorPos_y = height * 3 / 4;
    skyColour = [67, 103, 170];
    size = 0;
    scroll = 0;
    mode = -1; //true default mode
    // mode = 0; //current default for debugging
    clouds = [];
    trees_x = [];
    trees = [];
    canyons_x = [];
    canyons = []
    coins_Pos = [];
    coins = [];
    birds_Pos = [];
    birds = [];
    platforms_Pos = [];
    platforms = [];
    flag = true;
    groundDraw = false;
    scrollPos = 0;
    moveLeft = false;
    moveRight = false;
    x1 = 0;
    y1 = 0;
}

/*
This function will be used to add properties to arrays.
So if I want to add a tree at position x, then I'll do:
addElement(x, trees_x, Tree, trees[]) 
*/
function addElement(prop, prop_arr, obj, obj_array) {
    prop_arr.push(prop);
    obj_array.push(new obj(prop));
}

function mousePressed() {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        /*
        if adding canyon, then check if mouse has been clicked once.
        if it has, then start drawing a rectangle to show where the canyon 
        will be drawn. If mouse is clicked again, then use these two positions 
        at which mouse was clicked to add a new canyon, and verify that the pos are valid.
        */
        if (!moveLeft && !moveRight) { //so buttonPressed event does not accidentally coincide.
            if (mode === 1) {
                if (!flag) {
                    x1 = mouseX;
                    flag = true;
                } else {
                    // addElement([x1, mouseX - x1], canyons_x, Canyon, canyons);
                    addCanyon(x1 + scrollPos, mouseX + scrollPos);
                    flag = false;
                }
            }

            if (mode === 2) {
                addTree(mouseX + scrollPos);
            }

            if (mode === 3) {
                if (!flag) {
                    x1 = mouseX;
                    y1 = mouseY;
                    flag = true;
                } else {
                    addPlatform(x1 + scrollPos, y1, mouseX + scrollPos);
                    flag = false;
                }
            }

            if (mode === 4) {
                addCoin(mouseX + scrollPos, mouseY);
            }

            if (mode === 5) {
                addBird(mouseX + scrollPos, mouseY);
            }
            // addElement(mouseX + scrollPos, trees_x, Tree, trees);
            // addElement([mouseX, mouseY], birds_Pos, Bird, birds);
        }
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        if (mode === -1)
            mode++;

        else if (mode === 0) {
            temp = int(inputField.value());
        } else if (mode === 1) {
            // oneToTwo();
            mode++;
        } else if (mode === 2) {
            mode++;
        } else if (mode === 3) {
            mode++;
        } else if (mode === 4) {
            mode++;
        } else if (mode === 5) {
            mode++;
            //warning.
            // console.log('sure?');
        } else if (mode === 6) {
            exportLevelData();
            mode++;
        } else if (mode === 7) {
            console.log("khatam");
        }
    }

    if (key === 'b' || key === 'B') {
        if (mode === 1)
            flag = false;
            if (mode > 1) { 
                if (!flag) {
                mode--;
            }
        }
    }

    if (keyCode === 39) {
        if (scrollRightButton) {
            moveRight = true;
        }
    }
    if (keyCode === 37) {
        if (scrollLeftButton) {
            moveLeft = true;
        }
    }

}

function keyReleased() {
    if (keyCode === 37 || keyCode === 39) {
        moveLeft = false;
        moveRight = false;
    }
}

function zeroToOne() {
    alert('Valid input.');
    size = temp;
    temp = undefined;
    inputField.hide();
    inputField = null;
    fieldButton.hide();
    fieldButton = null;
    mode++;

    groundDraw = true;

    mountainStart = new Mountain(130);
    mountainEnd = new Mountain(size);

    for (let i = 0; i <= ((size + width) / 200); i++)
        clouds.push(new Cloud(i));

    scrollLeftButton = createButton('<');
    scrollRightButton = createButton('>');
    scrollLeftButton.position(width / 2 - 50, 0);
    scrollLeftButton.size(50, 50);
    scrollRightButton.position(width / 2, 0);
    scrollRightButton.size(50, 50);

    // scrollLeftButton.mousePressed(scrLeft);
    // scrollRightButton.mousePressed(scrRight);
    scrollLeftButton.mousePressed(() => {
        moveLeft = true;
    });
    scrollRightButton.mousePressed(() => {
        moveRight = true;
    });
    scrollLeftButton.mouseReleased(() => {
        moveLeft = false;
    });
    scrollRightButton.mouseReleased(() => {
        moveRight = false;
    });
}

function scrLeft() {
    if (scrollPos >= 0) {
        scrollPos -= scrollSpeed;
    }

    // console.log('left' + scrollPos);
}

function scrRight() {
    if (scrollPos + width - 200 <= size) {
        scrollPos += scrollSpeed;
    }

    // console.log('right' + scrollPos);
}

function addCanyon(x1, x2) {
    //in case being added in reverse
    if (x1 >= x2) {
        let temp = x1;
        x1 = x2;
        x2 = temp;
    }
    let w = x2 - x1;
    let err;
    //passed canyon is invalid if it intersects with pre-existing canyon/s or 
    //is too small or too large or either end is outside the supposed canvas.
    for (let i = 0; i < canyons.length; i++) {
        if (canyons[i].inside(x1) || canyons[i].inside(x2))
            err = 'Intersecting another canyon.';
    }

    if (w < 80 || w > 400)
        err = 'Size must be greater than 80 and less than 400. \nCurrent size = ' + w;

    if (x2 >= mountainEnd.leftMostPoint || x1 <= mountainStart.rightMostPoint)
        err = 'Cannot be under mountain.';

    if (err) {
        alert('Invalid canyon. \nERROR : ' + err);
        return;
    }

    addElement([x1, w], canyons_x, Canyon, canyons);
}

function addTree(x) {
    let err;

    for (let i = 0; i < canyons.length; i++) {
        if (canyons[i].inside(x))
            err = 'Cannot be inside canyon.';
    }
    if (x > mountainEnd.leftMostPoint || x < mountainStart.rightMostPoint)
        err = 'Cannot be on mountain.';

    if (err) {
        alert('Invalid tree.\nERROR : ' + err);
        return;
    }

    addElement(x, trees_x, Tree, trees);
}


function addPlatform(x1, y1, x2) {
    //in case being added in reverse
    if (x1 >= x2) {
        let temp = x1;
        x1 = x2;
        x2 = temp;
    }
    if (y1 < floorPos_y)
        addElement([x1, y1, x2, 15, true], platforms_Pos, Platform, platforms);
    else {
        alert("Invalid location for platform. Try again.");
    }
}

function addCoin(x, y) {
    let err;

    if (y > floorPos_y)
        err = "Cannot be in ground.";

    // if (x < mountainStart.rightMostPoint || x > mountainEnd.leftMostPoint)
    //     err = 'Cannot be in front of mountain';

    if (err) {
        alert("Invalid coin.\nERROR : " + err);
        return;
    }
    //changing that y value before passing because of the unique coordinate system for that class.
    addElement([x, floorPos_y - y], coins_Pos, Coin, coins);
}

function addBird(x, y) {
    let err;

    if (y > floorPos_y)
        err = "Cannot be in ground.";

    if (err) {
        alert("Invalid bird.\nERROR : " + err);
        return;
    }
    //changing that y value before passing because of the unique coordinate system for that class.
    addElement([x, y], birds_Pos, Bird, birds);

}

function exportLevelData() {
    let exp = {
        size,
        trees_x,
        canyons_x,
        coins_Pos,
        birds_Pos,
        platforms_Pos
    };
    saveJSON(exp, 'customLevel');
}


function showInstruction(s, h) {
    stroke(0);
    strokeWeight(2);
    textSize(20);
    fill(255);
    textAlign(CENTER);
    text(s, width / 2, (h || 200));
    textAlign(RIGHT);
    strokeWeight(0);
    stroke(255);
    fill(0);
    text(`or press B to go back.`, width, height - 10);
}

// function oneToTwo() {
//     mode++;
// }