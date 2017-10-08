
import {Controller} from "./component/Controller";
import {GameController} from "./GameController";
import {GameStatsController} from "./GameStatsController";
import {HomeController} from "./HomeController";

let AppController = Controller.createComponent("AppController");

AppController.defineMethod("initView", function () {
  if (!this.view) return;

  // Views

  let views = new Set(["home", "game", "game-stats"]);
  let activeView = "home";

  views.forEach(function (view) {
    this.view.querySelector(`.view.${view}`).hidden = view !== activeView;
  }, this);

  // Home view
  this.homeController = new HomeController(this.view.querySelector(".view.home"));
  this.homeController.componentOf = this;

  // Game view
  this.gameController = new GameController(this.view.querySelector(".view.game"));
  this.gameController.componentOf = this;

  // Game stats view
  this.gameStatsController = new GameStatsController(null, this.view.querySelector(".view.game-stats"));
  this.gameStatsController.componentOf = this;

  this.view.querySelector(".view.home .game-play").addEventListener("click", function () {

    // Hide home
    this.homeController.hideView();

    // Reset a 5-level game
    this.gameController.resetGame(5);

    // Show game view
    this.gameController.unhideView();

  }.bind(this));

});

export {AppController};
