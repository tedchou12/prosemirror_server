"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _color = _interopRequireDefault(require("color"));

var React = _interopRequireWildcard(require("react"));

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

var _clamp = _interopRequireDefault(require("./clamp"));

var _i18n = _interopRequireDefault(require("./i18n"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function generateGreyColors(count) {
  let cc = 255;
  const interval = cc / count;
  const colors = [];

  while (cc > 0) {
    const color = (0, _color.default)({
      r: cc,
      g: cc,
      b: cc
    });
    cc -= interval;
    cc = Math.floor(cc);
    colors.unshift(color);
  }

  return colors;
}

function generateRainbowColors(count, saturation, lightness) {
  const colors = [];
  const interval = 360 / count;
  const ss = (0, _clamp.default)(0, saturation, 100);
  const ll = (0, _clamp.default)(0, lightness, 100);
  let hue = 0;

  while (hue < 360) {
    const hsl = `hsl(${hue},${ss}%,${ll}%)`;
    const color = (0, _color.default)(hsl);
    colors.unshift(color);
    hue += interval;
  }

  return colors;
}

class ColorEditor extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_renderColor", (color, index) => {
      const selectedColor = this.props.hex;
      const hex = color.hex().toLowerCase();
      const style = {
        backgroundColor: hex
      };
      const active = selectedColor && selectedColor.toLowerCase() === hex;
      return /*#__PURE__*/React.createElement(_CustomButton.default, {
        active: active,
        className: "czi-color-editor-cell",
        key: `${hex}-${index}`,
        label: "",
        onClick: this._onSelectColor,
        style: style,
        value: hex
      });
    });

    _defineProperty(this, "_onSelectColor", hex => {
      this.props.close(hex);
    });
  }

  render() {
    const renderColor = this._renderColor;
    const selectedColor = this.props.hex;
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-color-editor"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-color-editor-section"
    }, /*#__PURE__*/React.createElement(_CustomButton.default, {
      active: !selectedColor,
      className: "czi-color-editor-color-transparent",
      label: (0, _i18n.default)("Transparent"),
      onClick: this._onSelectColor,
      value: "rgba(0,0,0,0)"
    })), /*#__PURE__*/React.createElement("div", {
      className: "czi-color-editor-section"
    }, generateGreyColors(10).map(renderColor)), /*#__PURE__*/React.createElement("div", {
      className: "czi-color-editor-section"
    }, generateRainbowColors(10, 90, 50).map(renderColor)), /*#__PURE__*/React.createElement("div", {
      className: "czi-color-editor-section"
    }, generateRainbowColors(30, 70, 70).map(renderColor)), /*#__PURE__*/React.createElement("div", {
      className: "czi-color-editor-section"
    }, generateRainbowColors(30, 90, 30).map(renderColor)));
  }

}

var _default = ColorEditor;
exports.default = _default;