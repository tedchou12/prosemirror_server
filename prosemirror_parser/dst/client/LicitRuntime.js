"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _http = require("./http");

// This implements the interface of `EditorRuntime`.
class LicitRuntime {
  // Image Proxy
  canProxyImageSrc() {
    return false;
  }

  getProxyImageSrc(src) {
    // This simulate a fake proxy.
    const suffix = 'proxied=1';
    return src.indexOf('?') === -1 ? `${src}?${suffix}` : `${src}&${suffix}`;
  } // Image Upload


  canUploadImage() {
    return true;
  }

  uploadImage(blob) {
    var img; // [FS-AFQ][03-MAR-2020][IRAD-884#2]
    // Note: Resolving the promise blindly after 3 seconds causes two issues, 
    // 1. Even if an image upload finishes in 700ms, it will take 3s for resolving the promise.
    // 2. If the image upload takes more than 3s, then the promise will be incorrectly resolved before completing the upload.
    // The following structure may be good to solve the issue.

    return new Promise((resolve, reject) => {
      // Use uploaded image URL.
      const url = '/saveimage?fn=' + blob.name;
      (0, _http.POST)(url, blob, 'application/octet-stream').then(data => {
        img = JSON.parse(data);
        resolve(img);
      }, err => {
        img = {
          id: '',
          width: 0,
          height: 0,
          src: ''
        };
        resolve(img);
      });
    });
  }

}

var _default = LicitRuntime;
exports.default = _default;