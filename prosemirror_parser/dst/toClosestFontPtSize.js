"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toClosestFontPtSize = toClosestFontPtSize;

var _convertToCSSPTValue = _interopRequireDefault(require("./convertToCSSPTValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// [FS-SEA][24-02-2020]
// overrided the method form 'convertToCSSPTValue.js' file to avoid the compiling issue .
// [FS][28-02-2020]
// IRAD-893 - Copy Paste From External Source Not Working
// removed {} from import, because convertToCSSPTValue is a default export function.
function toClosestFontPtSize(styleValue) {
  // duplicated FONT_PT_SIZES(available in ./ui/FontSizeCommandMenuButton)
  const FONT_PT_SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 90];
  const originalPTValue = (0, _convertToCSSPTValue.default)(styleValue);

  if (FONT_PT_SIZES.includes(originalPTValue)) {
    return originalPTValue;
  }

  return FONT_PT_SIZES.reduce((prev, curr) => {
    return Math.abs(curr - originalPTValue) < Math.abs(prev - originalPTValue) ? curr : prev;
  }, Number.NEGATIVE_INFINITY);
}