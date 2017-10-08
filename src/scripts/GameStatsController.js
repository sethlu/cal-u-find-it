
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

  let waterfall = new Waterfall();

  if (this.gameStats) Object.entries(this.gameStats.levels).forEach(function (entry) {
    let [index, levelStats] = entry;

    let template = cloneTemplate("#template-game-level-stats");
    let element = template.querySelector(".level-stats");

    element.classList.add("hidden"); // Hide the element

    template.querySelector(".level-prompt").innerText = levelStats.level.question;
    template.querySelector(".level-location-name").innerText = levelStats.level.locations[0].location;

    levelStatsElement.appendChild(template);

    waterfall = waterfall
      .then(function () {
        element.classList.remove("hidden"); // Show the element
      }, 80);

  });

});

export {GameStatsController};
