
import {Controller} from "./component/Controller";
import {GameController} from "./GameController";

let AppController = Controller.createComponent("AppController");

AppController.defineMethod("initView", function () {
  if (!this.view) return;

  // Views

  let views = new Set(["home", "game"]);
  let activeView = "home";

  views.forEach(function (view) {
    this.view.querySelector(`.view.${view}`).hidden = view !== activeView;
  }, this);

  // Home view
  let homeController = new Controller(this.view.querySelector(".view.home"));

  // Game view
  let gameController = new GameController(this.view.querySelector(".view.game"));

  this.view.querySelector(".view.home .game-play").addEventListener("click", function () {

    // Hide home
    homeController.hideView();

    // Reset a 5-level game
    gameController.resetGame(5);

    // Show game view
    gameController.unhideView();

  }.bind(this));

});

export {AppController};
