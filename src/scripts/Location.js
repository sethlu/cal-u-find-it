
import {getJSONAsync} from "./util";

function Location(info) {

  this.name = "";
  this.lat = 0;
  this.lon = 0;

  Object.assign(this, info);

}

Object.assign(Location, {

  getLocationsAsync: (function () {
    let locations;

    return function () {
      if (!locations) {
        locations = getJSONAsync("./datasets/locations.json");
      }
      return locations;
    };
  })()

});

export {Location};
