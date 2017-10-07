
function Level(params) {

  this.question = "";
  this.locations = []; // The 0th location is the correct one

  Object.assign(this, params);

}

export {Level};
