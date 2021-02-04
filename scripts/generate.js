let size; //for storing entered size of the level
let trees_x; //array of tree positions to be passed on to JSON
let trees; //array of tree objects
let canyons_x; //array of canyon positions to be passed on to JSON
let canyons; //array of canyon objects
let clouds; //array of cloud 
let mountainStart; //mountain where the level begins
let mountainEnd; //mountain where the level ends
let coins_Pos; //array of coin positions to be passed on to JSON
let coins; //array of coin objects
let birds_Pos; //array of bird positions to be passed on to JSON
let birds; //array of bird objects
let platforms_Pos; //array of platform positions to be passed on to JSON
let platforms; //array of platform objects
let floorPos_y; //height of floor
let skyColour; //bg colour
let inputField; //to input level size
let fieldButton; //to submit level size
let scrollLeftButton; //button to scroll left in level
let scrollRightButton; //button to scroll right in level
let flag; //boolean to contain whether the user is in the middle of drawing or not
let temp; //value of inputField will pass through this for validation
let scrollPos; //to control background scroll
const scrollSpeed = 5;
let x1; //to store the x position of the first mouse click in case of canyon, platform and bird
let y1; //to store the y position of the first mouse click in case of canyon, platform and bird
let moveLeft; //for background scrolling
let moveRight; //for background scrolling
let mode; //to store the mode

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
mode = 7 => save JSON file. End loop.
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


    //drawing whatever elements have been added so far.
    push();
    translate(-scrollPos, 0);
    clouds.forEach((cloud) => cloud.show());
    if (mountainStart)
        mountainStart.show();
    if (mountainEnd)
        mountainEnd.show();
    trees.forEach((tree) => tree.show());
    canyons.forEach((canyon) => canyon.show());
    coins.forEach((coin) => coin.show());
    platforms.forEach((platform) => platform.show());
    birds.forEach((bird) => {
        bird.update();
        bird.show();
    })
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
        showInstruction('Enter a valid size for the level (between 2000-20000)', 0)
        if (temp != undefined) {
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
        if (flag) { //clicked once
            push();
            fill(200, 0, 0);
            rect(x1, floorPos_y, mouseX - x1, height - floorPos_y);
            pop();
            showInstruction('Click again to finish drawing the canyon.', 2);
        } else {
            showInstruction(`Click anywhere to start drawing a canyon`, 1);
        }
    }



    //drawing trees mode
    else if (mode === 2) {
        showInstruction(`Click anywhere to place a tree on the ground`, 1);
        fill(200, 0, 0);
        rect(mouseX - 5, floorPos_y - 5, 10, 5);
    }




    //drawing platforms mode
    else if (mode === 3) {
        if (flag) {
            fill(200, 0, 0);
            rect(x1, y1, mouseX - x1, 15, 10);
            showInstruction(`Click anywhere to finish drawing this platform.`, 2);
        } else {
            showInstruction(`Click anywhere to start drawing a platform`, 1);
        }
    }




    //drawing coins mode
    else if (mode === 4) {
        showInstruction(`Click anywhere to add an animated collectable`, 1);
        textAlign(LEFT);
        text("Coins added : " + coins.length, 10, 30);
    }




    //drawing bird mode
    else if (mode === 5) {
        if (flag) {
            fill(200, 0, 0);
            rect(x1, y1, mouseX - x1, 2);
            showInstruction(`Click again to set the waddling distance for the bird.`, 2);
        } else {
            showInstruction(`Click anywhere to add a waddling bird`, 1);
        }
    }


    //confirmation
    else if (mode === 6) {
        showInstruction(`Press ENTER to confirm selections.`, 2);
    } else if (mode === 7) {
        showInstruction(`Now download the ejected JSON file, 
and drag and drop it on the game, available here.`, 0);
        fieldButton = createButton('didactic-waddle');
        fieldButton.mousePressed(() => {
            window.location = '/';
        });
        fieldButton.position(width / 2 - 80, height / 2 - 20);
        fieldButton.size(160, 40);
        noLoop();
    }



    if (moveLeft)
        scrLeft();
    else if (moveRight)
        scrRight();


}

function initialization() {
    floorPos_y = height * 3 / 4;
    // skyColour = [67, 103, 170];
    hr = (min(hour(), 24 - hour()) + 1) / 12; //the smaller this value will be, the darker the sky will be
    hr = (hr > 1) ? 1 : hr;
    skyColour = [90 * hr, 145 * hr, 245 * hr];
    size = 0;
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
    scrollPos = 0;
    moveLeft = false;
    moveRight = false;
    x1 = 0;
    y1 = 0;
}

function addElement(prop, prop_arr, obj, obj_array) {
    prop_arr.push(prop);
    obj_array.push(new obj(prop));
}

function removeElement(prop_arr, obj_arr) {
    if (prop_arr.length > 0 && obj_arr.length > 0) {
        obj_arr.pop();
        prop_arr.pop();
    } else {
        alert("Nothing to pop.");
    }
}

function mousePressed() {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 50 && mouseY <= height) {
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
                if (!flag) {
                    x1 = mouseX;
                    y1 = mouseY;
                    flag = true;
                } else {
                    addBird(x1 + scrollPos, y1, mouseX - x1);
                    flag = false;
                }
            }
        }
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        if (mode === -1)
            mode++;
        else if (mode === 0) {
            temp = int(inputField.value());
        } else if (mode === 6) {
            exportLevelData();
            mode++;
        } 
    }

    if (key === 'b' || key === 'B') {
        if (flag) {
            if (mode === 1 || mode === 3 || mode === 5)
                flag = false;
        } else {
            if (mode === 1) {
                removeElement(canyons_x, canyons);
            } else if (mode === 2) {
                removeElement(trees_x, trees);
            } else if (mode === 3) {
                removeElement(platforms_Pos, platforms);
            } else if (mode === 4) {
                removeElement(coins_Pos, coins);
            } else if (mode === 5) {
                removeElement(birds_Pos, birds);
            } else if (mode === 6) {
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
    size = temp;
    temp = undefined;
    inputField.hide();
    inputField = null;
    fieldButton.hide();
    fieldButton = null;
    mode++;


    mountainStart = new Mountain(130);
    mountainEnd = new Mountain(size);

    for (let i = 0; i <= ((size + width) / 200); i++)
        clouds.push(new Cloud(i));


    //buttons for scrolling :
    scrollLeftButton = createButton('<');
    scrollRightButton = createButton('>');
    scrollLeftButton.position(width / 2 - 50, 50);
    scrollLeftButton.size(50, 50);
    scrollRightButton.position(width / 2, 50);
    scrollRightButton.size(50, 50);

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

    //buttons for navigating between modes : 
    canyonsButton = createButton("Draw Canyons");
    canyonsButton.mousePressed(() => {
        mode = 1;
        flag = false;
    });
    canyonsButton.size(80, 50);
    canyonsButton.position(width / 2 - 40 * 5, 0);
    treesButton = createButton("Draw Trees");
    treesButton.mousePressed(() => {
        mode = 2;
        flag = false;
    });
    treesButton.size(80, 50);
    treesButton.position(width / 2 - 40 * 3, 0);
    platformsButton = createButton("Draw Platforms");
    platformsButton.mousePressed(() => {
        mode = 3;
        flag = false;
    });
    platformsButton.size(80, 50);
    platformsButton.position(width / 2 - 40 * 1, 0);
    coinsButton = createButton("Draw Coins");
    coinsButton.mousePressed(() => {
        mode = 4;
        flag = false;
    });
    coinsButton.size(80, 50);
    coinsButton.position(width / 2 + 40 * 1, 0);
    birdsButton = createButton("Draw Birds");
    birdsButton.mousePressed(() => {
        mode = 5;
        flag = false;
    });
    birdsButton.size(80, 50);
    birdsButton.position(width / 2 + 40 * 3, 0);
    doneButton = createButton("Click here when done.");
    doneButton.size(100, 80);
    doneButton.position(width - 150, 0);
    doneButton.mousePressed(() => {
        mode = 6;
        flag = false;
    })


}

function scrLeft() {
    if (scrollPos >= 0) 
        scrollPos -= scrollSpeed;
}

function scrRight() {
    if (scrollPos + width - 200 <= size) 
        scrollPos += scrollSpeed;
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
    else 
        alert("Invalid location for platform. Try again.");
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

function addBird(x, y, w) {
    let err;

    if (y > floorPos_y)
        err = "Cannot be in ground.";

    if (err) {
        alert("Invalid bird.\nERROR : " + err);
        return;
    }

    addElement([x, y, abs(w)], birds_Pos, Bird, birds);
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


function showInstruction(s, f) {
    stroke(0);
    strokeWeight(2);
    textSize(20);
    fill(255);
    textAlign(CENTER);
    text(s, width / 2, 200);
    textAlign(RIGHT);
    strokeWeight(0);
    stroke(255);
    fill(255);
    noStroke();
    textSize(15);
    if (f === 1)
        text(`press B to pop.`, width, height - 10);
    else if (f === 2)
        text(`press B to go back.`, width, height - 10);
}