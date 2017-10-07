
import {Controller} from "./component/Controller";
import {Level} from "./Level";

let GameController = Controller.createComponent("GameController");

/**
 * Generates a list of levels
 */
GameController.generateLevelsAsync = function (numLevels = 5) {
  return Location.getLocationsAsync()
    .then(function (locations) {
      let levels = [];

      // TODO: Actually generate levels
      levels.push(new Level({
        question: locations[0].question[0],
        locations: [
          locations[0],
          locations[1]
        ]
      }));

      return levels;
    });
};

/**
 * Init the game controller
 */
GameController.defineMethod("init", function () {

  /** Current level of the game */
  this.level = 0;

  /** A list of levels */
  this.levels = [];

});

/**
 * Init the game view
 */
GameController.defineMethod("initView", function () {

});

/**
 * Resets the game progress
 * Set to level 0
 */
GameController.defineMethod("resetGame", function () {

  // Display the first level
  this.selectLevel(0);

});

/**
 * Displays the next level in the game
 * Returns false if there is no next level
 */
GameController.defineMethod("nextLevel", function () {

  // Display a next level, if possible
  return this.selectLevel(this.level + 1);

});

/**
 * Switches to a level
 */
GameController.defineMethod("selectLevel", function (level) {

  if (level >= this.levels.length) return false;

  // Unset the graphics for the current level



  // Switch to new level
  this.level = level;

  // Set the graphics for the new level



});

export {GameController};
