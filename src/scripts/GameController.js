
import {Controller} from "./component/Controller";
import {Location} from "./Location";
import {Level} from "./Level";
import {GameStats} from "./GameStats";
import {LevelStats} from "./LevelStats";

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

  /** Game stats */
  this.gameStats = new GameStats();

  // Map rendering

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

      let appController = this.componentOf;

      // Hide game
      this.hideView();

      // Update game stats
      appController.gameStatsController.gameStats = this.gameStats;
      appController.gameStatsController.updateView(); // Force update view

      // Show game stats
      appController.gameStatsController.unhideView();

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

GameController.defineMethod("unhideView", function () {

  // Refresh the map
  setTimeout(function () {
    this.gameMap.invalidateSize();
  }.bind(this), 1);

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

  // Clear game stats
  this.gameStats.resetStats();

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

  let {question, locations} = this.levels[this.level];

  this.view.querySelector(`[data-level="prompt"]`).innerText = question;

  this.gameMap.setView([36.7783, -119.4179], 6);

  for (let i = 0; i < locations.length; i++) {
    let marker = L.marker([locations[i].lat, locations[i].lon]);
    this.locMarkers.push(marker);
    marker.addTo(this.gameMap);

    marker.on("click", function () {
      if (i === 0) {

        // Record level stats
        this.gameStats.recordLevelStats(
          this.level,
          new LevelStats(this.levels[this.level], {
            timeRemaining: 1 // 1 sec remaining from game
          })
        );

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

  let location = this.levels[this.level].locations[0];

  splashElement.querySelector(".level-location-img").style.backgroundImage = `url(${location.image})`;
  splashElement.querySelector(".level-location-name").innerText = location.location;
  splashElement.querySelector(".level-location-coords").innerText =
    `${Math.abs(location.lat)}° ${location.lat >= 0 ? "N" : "S"}, ${Math.abs(location.lon)}° ${location.lon >= 0 ? "E" : "W"}`;

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
