
import {Model} from "./component/Model";

let GameStats = Model.createComponent("GameStats");

GameStats.defineMethod("init", function () {

  this.levels = []; // Stats for levels

});

Object.assign(GameStats.prototype, {

  recordLevelStats: function (level, levelStats) {

    this.levels[level] = levelStats;

  },

  resetStats: function () {

    this.levels = [];

  }

});

export {GameStats};