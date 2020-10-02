"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertToCSSPTValue;
exports.PT_TO_PX_RATIO = exports.PX_TO_PT_RATIO = void 0;
const SIZE_PATTERN = /([\d\.]+)(px|pt)/i;
const PX_TO_PT_RATIO = 0.75292857;
exports.PX_TO_PT_RATIO = PX_TO_PT_RATIO;
const PT_TO_PX_RATIO = 1 / PX_TO_PT_RATIO;
exports.PT_TO_PX_RATIO = PT_TO_PX_RATIO;

function convertToCSSPTValue(styleValue) {
  const matches = styleValue.match(SIZE_PATTERN);

  if (!matches) {
    return 0;
  }

  let value = parseFloat(matches[1]);
  const unit = matches[2];

  if (!value || !unit) {
    return 0;
  }

  if (unit === 'px') {
    value = PX_TO_PT_RATIO * value;
  }

  return value;
}