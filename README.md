
# [didactic waddle](https://didactic-waddle-level.netlify.app) #
author: @shameekbaranwal

A simple 2D web game project designed using the p5.js framework, that involves a character traversing from mountain to mountain in a two-dimensional world full of background elements like clouds, trees, birds, canyons, platforms, and collectable coins. The game makes use of the side-scrolling technique, which means that upon reaching the end of the visible world, the background will begin to scroll in the opposite direction, giving the illusion of further motion. Apart from the actual game, a level-generating engine is available, using which a user can generate custom levels with manually positioned elements, and then `drag and drop` the generated level data file on the game and play it instantly.

## Gameplay : ##

At the beginning of every level, the player will spawn in front of a mountain, and he must avoid hitting birds and falling into canyons and make clever use of the available platforms to collect as many coins as possible, and reach the second mountain, where the level will end, and there will be an option to proceed to the next. Currently, the game has `5` preset levels, but the player can make use of the GUI level generator to create as many levels as they like. Instructions on how to create levels available ahead.

 **If you create sufficiently challenging levels, consider contributing those level JSON files to the game by making a pull-request. Detailed instructions on how to contribute available ahead.** 


## How to :  ##

> ### play the game ###
The player can use the `left` and `right` `arrow keys` to control the horizontal motion of the character, and the `spacebar` to jump. Additionally, the `M` key can be used to mute the sound effects, and the `R` key to restart the current level. At the end of every level, pressing the `ENTER` key will take you to the next one, if available.

> ### create levels using the GUI Engine ###
Upon entering the game, the player will have the option to play the preset levels, or to go to the level generator to create custom levels, or to `drop` a pre-made custom level data file. Click on the button, and it'll redirect you to the engine. Once there, enter the size of your level in pixels (which will correspond to the distance between the two mountains). Once a valid value is entered, the clouds and mountains and ground will spawn. You can use the `left` and `right` `arrow keys` to scroll across the level. Now you'll have entered the mode - 

* `1` : Canyons. Click anywhere on the canvas to start drawing a canyon on the ground based on the X co-ordinate of your cursor, and click again at some valid distance to finish drawing the canyons. Repeat this process till you've reached the desired number of canyons, then press `ENTER` to move on to the next mode -

* `2` : Trees. Click anywhere on the canvas once to add a tree to the ground based on the X co-ordinate of your cursor. Repeat until you've reached the desired number of trees. Once done, press `ENTER` to move to the next mode - 

* `3` : Platforms. Click anywhere on the canvas to start drawing a platform based on the X and Y co-ordinates of your cursor, and click again at some valid distance to finish drawing that platform. Repeat until you've reached the desired number of platforms, then press `ENTER` to move to the next mode - 

* `4` : Coins. Click anywhere on the canvas once to add a collectable coin based on the X and Y co-ordinates of your cursor. Note that these coins are meant to be collected by the character, so create them only in the accessible locations. Repeat until you've reached the desired number of coins, then press `ENTER` to move to the next mode - 

* `5` : Birds. Click anywhere on the canvas to start drawing a bird, based on the X and Y co-ordinates of your cursor. Then, click again at a valid distance to specify the "waddling" radius of the bird. Note that upon touching any bird, the game will end and the player will have to restart the level, so add birds in a way that it doesn't make crossing the level impossible. Repeat until you've reached the desired number of birds, then press `ENTER` to move to the next mode -

* `6` : This is a confirmation prompt, in which you'll be able to scroll through the level you just created, and if you want to change anything, press `B` to go back. If you're satisfied with the level and want to download the file, press `ENTER`. 

Once you've downloaded the customLevel.JSON file, go back to the original game using the available button, and `drag and drop` the file on the canvas, and play it as many times you want.

> ### contribute levels to the game ###
If you've made any challenging level that you'd like to be included in the preset levels, do the following steps

   * Download the JSON file from the level generator.
   * Fork the repository to your local machine.
   * Rename the file as `level-6.json`, and paste it in `/config/`
   * Next, open the `/scripts/sketch.js` file, scroll to the function preload(), and paste the following line of code 
        `loadJSON('config/level-6.json');`
    here: 

![](images/loadJSON%20ss.png)



## Screenshots : ##

![](images/launchScreen%20ss.png)

![](images/gameplay%20ss.png)

You can check out the latest release [`here`](https://didactic-waddle-level.netlify.app)