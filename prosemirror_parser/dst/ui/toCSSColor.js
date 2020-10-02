"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTransparent = isTransparent;
exports.toCSSColor = toCSSColor;
exports.default = void 0;

var _color = _interopRequireDefault(require("color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RGBA_PATTERN = /^rgba/i;
const RGBA_TRANSPARENT = 'rgba(0,0,0,0)';
const ColorMaping = {
  transparent: RGBA_TRANSPARENT,
  inherit: ''
};

function isTransparent(source) {
  if (!source) {
    return true;
  }

  const hex = toCSSColor(source);
  return !hex || hex === RGBA_TRANSPARENT;
}

function toCSSColor(source) {
  if (!source) {
    return '';
  }

  if (source in ColorMaping) {
    return ColorMaping[source];
  }

  if (source && RGBA_PATTERN.test(source)) {
    const color = (0, _color.default)(source);

    if (color.valpha === 0) {
      ColorMaping[source] = RGBA_TRANSPARENT;
      return RGBA_TRANSPARENT;
    }

    const rgba = color.toString();
    ColorMaping[source] = rgba.toString();
    return rgba;
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

var _default = toCSSColor;
exports.default = _default;