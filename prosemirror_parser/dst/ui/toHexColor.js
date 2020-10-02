"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toHexColor;

var _color = _interopRequireDefault(require("color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ColorMaping = {
  'transparent': '',
  'inherit': ''
};

function toHexColor(source) {
  if (!source) {
    return '';
  }

  if (source in ColorMaping) {
    return ColorMaping[source];
  }

  let hex = '';

  try {
    hex = (0, _color.default)(source).hex().toLowerCase();
    ColorMaping[source] = hex;
  } catch (ex) {
    console.warn('unable to convert to hex', source);
    ColorMaping[source] = '';
  }

  return hex;
}