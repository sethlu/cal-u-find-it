
import {Component} from "./component/Component";

let GameController = Component.createComponent("GameController");

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

GameController.defineMethod("selectLevel", function (level) {

  if (level >= this.levels.length - 1) return false;

  // Changing the graphics

});

export {GameController};
