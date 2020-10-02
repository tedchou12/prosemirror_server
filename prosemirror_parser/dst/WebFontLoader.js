"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class WebFontLoader {
  constructor() {
    _defineProperty(this, "_implementation", null);
  }

  setImplementation(impl) {
    this._implementation = impl;
  }

  load(params) {
    const impl = this._implementation;

    if (impl) {
      impl.load(params);
    } else {
      console.warn('Method WebFontLoader.load does not have an implementation');
    }
  }

}

const loader = new WebFontLoader();
var _default = loader;
exports.default = _default;