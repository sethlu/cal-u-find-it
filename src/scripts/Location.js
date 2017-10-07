
import {getJSONAsync} from "./util";

function Location(info) {

  this.name = "";
  this.latitude = 0;
  this.longitude = 0;

  Object.assign(this, info);

}

Object.assign(Location, {

  getLocationsAsync: (function () {
    let locations;

    return (function () {
      if (!locations) {
        locations = getJSONAsync("../locations.json");
      }
      return locations;
    })();
  })()

});

export {Location};
