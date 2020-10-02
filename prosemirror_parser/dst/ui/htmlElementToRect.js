"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = htmlElementToRect;

function htmlElementToRect(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    w: rect.width,
    h: rect.height
  };
}