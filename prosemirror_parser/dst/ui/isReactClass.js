"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isReactClass;

function isReactClass(maybe) {
  if (typeof maybe !== 'function') {
    return false;
  }

  const proto = maybe.prototype;

  if (!proto) {
    return false;
  }

  return !!proto.isReactComponent;
}