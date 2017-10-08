
import {Controller} from "./component/Controller";

let HomeController = Controller.createComponent("HomeController");

HomeController.defineMethod("initView", function () {
  if (!this.view) return;

  this.homeMap = L.map("homeMap", {
    zoomControl: false
  });

  this.homeMap._handlers.forEach(function (handler) {
    handler.disable();
  });

  L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
    attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>`,
    subdomains: "abcd",
    maxZoom: 19
  })
    .addTo(this.homeMap);

  this.homeMap.setView([37.7754, -119.4179], 6);

});

HomeController.defineMethod("unhideView", function () {

  // Refresh the map
  setTimeout(function () {
    this.homeMap.invalidateSize();
  }.bind(this), 1);

});

export {HomeController};
