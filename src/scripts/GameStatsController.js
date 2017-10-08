
import {SingleModelController} from "./component/SingleModelController";
import {clearChildNodes} from "./util";
import {cloneTemplate} from "./component/Controller";
import {Waterfall} from "./component/Waterfall";

let GameStatsController = SingleModelController.createComponent("GameStatsController");

GameStatsController.defineAlias("model", "gameStats");

GameStatsController.defineMethod("initView", function () {
  if (!this.view) return;

  this.view.querySelector(".game-replay").addEventListener("click", function () {

    let appController = this.componentOf;

    // Hide the current view
    this.hideView();

    // Reset a game with same amount of levels
    appController.gameController.resetGame(appController.gameController.levels.length);

    // Show game view
    appController.gameController.unhideView();

  }.bind(this));

  this.view.querySelector(".game-home").addEventListener("click", function () {

    let appController = this.componentOf;

    // Hide the current view
    this.hideView();

    // Show home view
    appController.homeController.unhideView();

  }.bind(this));

});

GameStatsController.defineMethod("updateView", function () {
  if (!this.view) return;

  let levelStatsElement = this.view.querySelector(".levels-stats");
  clearChildNodes(levelStatsElement);

  let levelStatsButtonsElement = this.view.querySelector(".buttons");
  levelStatsButtonsElement.hidden = true;
  levelStatsButtonsElement.classList.add("hidden");
  levelStatsButtonsElement.hidden = false;

  let waterfall = new Waterfall();

  let totalPoints = 0;

  if (this.gameStats) for (let levelStats of this.gameStats.levels) {

    totalPoints += levelStats.stats.points;

    let template = cloneTemplate("#template-game-level-stats");
    let element = template.querySelector(".level-stats");

    element.classList.add("hidden"); // Hide the element

    let location = levelStats.level.locations[0];

    template.querySelector(".level-prompt").innerText = levelStats.level.question;
    template.querySelector(".level-location-name").innerText = location.location;
    template.querySelector(".level-location-image").style.backgroundImage = `url("${location.image}")`;

    levelStatsElement.appendChild(template);

    waterfall = waterfall
      .then(function () {
        element.classList.remove("hidden"); // Show the element
      }, 80);

  }

  this.view.querySelector(".game-score").innerText = totalPoints;

  waterfall = waterfall
    .then(function () {
      levelStatsButtonsElement.classList.remove("hidden");
    })

});

export {GameStatsController};
