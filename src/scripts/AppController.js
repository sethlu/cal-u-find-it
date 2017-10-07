
import {Controller} from "./component/Controller";

let AppController = Controller.createComponent("AppController");

AppController.defineMethod("initView", function () {
  if (!this.view) return;

  let views = new Set(["home", "game"]);
  let activeView = "game";

  views.forEach(function (view) {
    this.view.querySelector(`[data-view="${view}"]`).hidden = view !== activeView;
  }, this);

});

export {AppController};
