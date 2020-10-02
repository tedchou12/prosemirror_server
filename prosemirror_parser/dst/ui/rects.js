"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCollapsed = isCollapsed;
exports.isIntersected = isIntersected;
exports.fromXY = fromXY;
exports.fromHTMlElement = fromHTMlElement;

function isCollapsed(rect) {
  return rect.w === 0 || rect.h === 0;
}

function isIntersected(r1, r2, padding) {
  const pp = padding || 0;
  return !(r2.x - pp > r1.x + r1.w + pp || r2.x + r2.w + pp < r1.x - pp || r2.y - pp > r1.y + r1.h + pp || r2.y + r2.h + pp < r1.y - pp);
}

function fromXY(x, y, padding) {
  padding = padding || 0;
  return {
    x: x - padding,
    y: y - padding,
    w: padding * 2,
    h: padding * 2
  };
}

function fromHTMlElement(el) {
  const display = document.defaultView.getComputedStyle(el).display;

  if (display === 'contents' && el.children.length === 1) {
    // el has no layout at all, use its children instead.
    return fromHTMlElement(el.children[0]);
  }

  const rect = el.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    w: rect.width,
    h: rect.height
  };
}