
import {SingleModelController} from "./component/SingleModelController";
import {clearChildNodes} from "./util";
import {cloneTemplate} from "./component/Controller";

let GameStatsController = SingleModelController.createComponent("GameStatsController");

GameStatsController.defineAlias("model", "gameStats");

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
