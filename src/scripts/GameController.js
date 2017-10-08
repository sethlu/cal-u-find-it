
import {Controller} from "./component/Controller";
import {Waterfall} from "./component/Waterfall";
import {Location} from "./Location";
import {Level} from "./Level";
import {GameStats} from "./GameStats";
import {LevelStats} from "./LevelStats";

let GameController = Controller.createComponent("GameController");

/**
 * Generates a list of levels
 */
function randomGenerator(listLocations) {
  let i, curr, top = listLocations.length;
  if (top) while(--top) {
    curr = Math.floor(Math.random() * (top + 1));
    i = listLocations[curr];
    listLocations[curr] = listLocations[top];
    listLocations[top] = i;
  }
  return listLocations;

}

function distanceFormula(correctLoc, compLoc) {
  let changeInX = correctLoc.lat - compLoc.lat;
  let changeInY = correctLoc.lon - compLoc.lon;
  return Math.sqrt((changeInX * changeInX) + (changeInY * changeInY));
}

GameController.generateLevelsAsync = function (numLevels = 5) {
  return Location.getLocationsAsync()
    .then(function (locations) {
      let mixedLocation = randomGenerator(locations);
      let levels = [];

      // TODO: If successful in making multiple questions for each location, random number generator needs to be created.

      for (let i = 0; i < numLevels; i++) {
        levels.push(new Level({
          question: mixedLocation[i].question[0],
          locations: [
            mixedLocation[i]
          ]
        }));
      }
      for (let j = 0; j < levels.length; j++) {
        let tempList = randomGenerator(locations);
        for (let k = 0; k < tempList.length; k++) {
          if (levels[j].locations[0] !== tempList[k]) {

            let distance = distanceFormula(levels[j].locations[0], tempList[k]);
            if (distance < 1 || distance > 8) {
              continue;
            }

            let everythingWorks = true;

            for (let l = 1; l < levels[j].locations.length; l++) {
              let distance = distanceFormula(levels[j].locations[l], tempList[k]);
              if (distance < 1) {
                everythingWorks = false;
                break;
              }
            }

            if (everythingWorks === false) {
              continue;
            }

            levels[j].locations.push(tempList[k]);
            if (levels[j].locations.length >= 5) {
              break;
            }

          }
        }
      }
      return levels;
    });
};

/**
 * Init the game controller
 */
GameController.defineMethod("init", function () {

  /** Current level of the game */
  this.level = false;

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

  this.gameMap = L.map("map", {
    zoomControl: false
  });

  L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; 2017 OpenStreetMap contributors",
    minZoom: "6",
    maxZoom: "6"
  })
    .addTo(this.gameMap);

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

    // Reset to no level selected for quick level selection
    this.level = false;

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

  let waterfall = new Waterfall();

  waterfall = waterfall.then(function () {

    // Unset the graphics for the current level

    for (let i = 0; i < this.locMarkers.length; i++) {
      this.locMarkers[i].remove();
    }
    this.locMarkers = [];

  }.bind(this));

  if (this.level !== false) // No need to hide the prompt if not previously on a level
    waterfall = waterfall.then(function () {

      // Hide the prompt box
      promptElement.classList.add("hidden");

    }.bind(this), 300);

  waterfall = waterfall.then(function () {

    // Switch to new level
    this.level = level;

  }.bind(this));

  // Set the graphics for the new level

  let promptElement = this.view.querySelector(`.prompt`);

  waterfall = waterfall
    .then(function () {

      let {question, locations} = this.levels[this.level];

      this.view.querySelector(`[data-level="prompt"]`).innerText = question;

      this.gameMap.setView([37.7754, -119.4179], 6);

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
                timeRemaining: 1 // TODO: Seconds remaining from level
              })
            );

            this.showLevelLocationSplash();

          } else {

            // TODO: Probably give time penalty
            alert("Try the other one(s)");

          }
        }.bind(this));

      }

    }.bind(this))
    .then(function () {

      // Show the prompt element
      promptElement.classList.remove("hidden");

    }, 300);

  return true; // Changed to the level selected

});

/**
 * Display a splash screen for the location of the level
 * The button directs to a next level, or to a finishing screen
 */
GameController.defineMethod("showLevelLocationSplash", function () {

  let splashElement = this.view.querySelector(".level-location-splash");

  splashElement.classList.add("hidden"); // Set transparent
  splashElement.classList.remove("out"); // Reset entering position
  splashElement.hidden = false;

  let location = this.levels[this.level].locations[0];

  splashElement.querySelector(".level-location-img").style.backgroundImage = `url(${location.image})`;
  splashElement.querySelector(".level-location-name").innerText = location.location;
  splashElement.querySelector(".level-location-coords").innerText =
    `${Math.abs(location.lat)}° ${location.lat >= 0 ? "N" : "S"}, ${Math.abs(location.lon)}° ${location.lon >= 0 ? "E" : "W"}`;

  setTimeout(function () {
    splashElement.classList.remove("hidden");
  }, 1);

});

/**
 * Hides the splash screen
 */
GameController.defineMethod("hideLevelLocationSplash", function () {

  let splashElement = this.view.querySelector(".level-location-splash");

  splashElement.classList.add("hidden", "out"); // Use exiting position

  setTimeout(function () {
    splashElement.hidden = true;
  }, 350);

});

export {GameController};
