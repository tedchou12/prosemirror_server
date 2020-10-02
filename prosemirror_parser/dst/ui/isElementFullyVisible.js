"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isElementFullyVisible;

var _rects = require("./rects");

function isElementFullyVisible(el) {
  const {
    x,
    y,
    w,
    h
  } = (0, _rects.fromHTMlElement)(el); // Only checks the top-left point.

  const nwEl = w && h ? el.ownerDocument.elementFromPoint(x + 1, y + 1) : null;

  if (!nwEl) {
    return false;
  }

  if (nwEl === el) {
    return true;
  }

  if (el.contains(nwEl)) {
    return true;
  }

  return false;
}