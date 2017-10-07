
function getJSONAsync(url) {
  return new Promise(function (resolve, reject) {
    let request = new XMLHttpRequest();
    function transferCompleted() {
      resolve(request.response);
    }
    function transferFailed() {
      reject();
    }
    request.addEventListener("load", transferCompleted);
    request.addEventListener("error", transferFailed);
    request.addEventListener("abort", transferFailed);
    request.open("GET", url);
    request.responseType = "json";
    request.send();
  });
}

export {getJSONAsync};
