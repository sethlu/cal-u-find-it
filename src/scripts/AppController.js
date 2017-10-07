
import {Controller} from "./component/Controller";
import {GameController} from "./GameController";

let AppController = Controller.createComponent("AppController");

AppController.defineMethod("initView", function () {
  if (!this.view) return;

  // Views

  let views = new Set(["home", "game"]);
  let activeView = "game";

  views.forEach(function (view) {
    this.view.querySelector(`.view.${view}`).hidden = view !== activeView;
  }, this);

  // Game view
  let gameController = new GameController(this.view.querySelector(`.view.game`));

});

export {AppController};
