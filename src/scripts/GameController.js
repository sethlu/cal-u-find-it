
import {Controller} from "./component/Controller";
import {Location} from "./Location";
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

  this.locMarkers = [];

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

  for (let i = 0; i < this.locMarkers.length; i++) {
    this.locMarkers[i].remove();
  }
  this.locMarkers = [];

  // Switch to new level
  this.level = level;

  // Set the graphics for the new level

  let game_map = L.map('map').setView([36.7783, -119.4179], 6);
  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {attribution: 'Map data &copy; 2017 OpenStreetMap contributors', minZoom: '5', maxZoom: '7'}).addTo(game_map);


  let {question, locations} = this.levels[this.level];

  for (let i = 0; i < locations.length; i++) {
    let marker = L.marker([locations[i].lat, locations[i].lon]);
    this.locMarkers.push(marker);
    marker.addTo(game_map);

  }


});

export {GameController};
