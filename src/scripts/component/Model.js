
import {Component} from "./Component";

let Model = Component.createComponent("Model");

Model.models = {count: 0};

Model.defineMethod("construct", function construct() {
  // Construct modelId
  Object.defineProperty(this, "modelId", {
    value: ++Model.models.count
  });
  Model.models[this.modelId] = this;
  // Construct controllers
  Object.defineProperty(this, "controllers", {
    value: {}
  });
  // Construct jointModels
  Object.defineProperty(this, "jointModels", {
    value: {}
  });
});

Model.defineMethod("destruct", function destruct() {
  // Destruct jointModels
  for (let modelId in this.jointModels) {
    // Request jointModel to release model
    this.jointModels[modelId].releaseModel(this);
  }
  // Destruct controllers
  for (let controllerId in this.controllers) {
    // Request controller to release model
    this.controllers[controllerId].releaseModel(this);
  }
  // Destruct modelId
  delete Model.models[this.modelId];
});

Model.defineMethod("destroy", function destroy(destroyControllers = false, destroyViews = false) {
  if (destroyControllers) {
    // The controller to be destroyed with its view removed
    for (let controllerId in this.controllers) {
      this.controllers[controllerId].destroy(destroyViews);
    }
  }
});

// This function is used to propagate the content update event to controllers and jointModels
Model.defineMethod("didUpdate", function didUpdate() {
  // Broadcast controllers that the model itself was just updated
  for (let controllerId in this.controllers) {
    this.controllers[controllerId].modelDidUpdate(this);
  }
  // Broadcast jointModels that the model itself was just updated
  for (let modelId in this.jointModels) {
    this.jointModels[modelId].modelDidUpdate(this);
  }
});

export {Model};
