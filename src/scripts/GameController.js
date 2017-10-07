
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
      levels.push(new Level({
        question: locations[2].question[0],
        locations: [
          locations[2],
          locations[3]
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
  if (!this.view) return;

  this.view.querySelector(".level-location-splash").hidden = true;

  this.view.querySelector(".level-next").addEventListener("click", function () {

    this.hideLevelLocationSplash();

    if (!this.nextLevel()) {
      // TODO: Reached the end of the game
      console.log("End of the game");
    }

  }.bind(this));

  this.gameMap = L.map("map");

  L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; 2017 OpenStreetMap contributors",
    minZoom: "5",
    maxZoom: "7"
  })
    .addTo(this.gameMap);

  // TODO: Use AppController to control game status

  this.resetGame(2);

});

/**
 * Resets the game progress
 * Set to level 0
 */
GameController.defineMethod("resetGame", function (resetLevels = false) {

  let promise = Promise.resolve();

  if (resetLevels !== false) {
    promise = promise.then(function () {
      return GameController.generateLevelsAsync(resetLevels)
        .then(function (levels) {
          this.levels = levels;
        }.bind(this));
    }.bind(this))
  }

  return promise.then(function () {
    // Display the first level
    this.selectLevel(0);
  }.bind(this));

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

  this.gameMap.setView([36.7783, -119.4179], 6);

  let {question, locations} = this.levels[this.level];

  for (let i = 0; i < locations.length; i++) {
    let marker = L.marker([locations[i].lat, locations[i].lon]);
    this.locMarkers.push(marker);
    marker.addTo(this.gameMap);

    marker.on("click", function () {
      if (i === 0) {
        this.showLevelLocationSplash();
      } else {
        // TODO: Probably give time penalty
        alert("Try the other one(s)");
      }
    }.bind(this));

  }

  return true; // Changed to the level selected

});

/**
 * Display a splash screen for the location of the level
 * The button directs to a next level, or to a finishing screen
 */
GameController.defineMethod("showLevelLocationSplash", function () {

  let splashElement = this.view.querySelector(".level-location-splash");

  splashElement.classList.remove("hidden");
  splashElement.hidden = false;

  splashElement.querySelector(`[data-level-location="name"]`).innerText = this.levels[this.level].locations[0].location;

});

/**
 * Hides the splash screen
 */
GameController.defineMethod("hideLevelLocationSplash", function () {

  let splashElement = this.view.querySelector(".level-location-splash");

  splashElement.classList.add("hidden");
  splashElement.hidden = true;

});

export {GameController};
