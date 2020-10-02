"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = throttle;

function throttle(fn, threshhold, context) {
  let last;
  let deferTimer;
  const boundFn = fn.bind(context);
  return function () {
    const now = Date.now();
    const args = Array.prototype.slice.call(arguments);

    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        boundFn.apply(null, args);
      }, threshhold);
    } else {
      last = now;
      boundFn.apply(null, args);
    }
  };
}