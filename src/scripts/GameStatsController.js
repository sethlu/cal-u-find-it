
import {SingleModelController} from "./component/SingleModelController";
import {clearChildNodes} from "./util";
import {cloneTemplate} from "./component/Controller";

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

  if (this.gameStats) Object.entries(this.gameStats.levels).forEach(function (entry) {
    let [index, levelStats] = entry;

    let template = cloneTemplate("#template-game-level-stats");

    template.querySelector(`[data-level-location="name"]`).innerText = levelStats.level.locations[0].location;

    levelStatsElement.appendChild(template);
  });

});

export {GameStatsController};
