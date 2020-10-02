"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _renderLaTeXAsHTML = _interopRequireDefault(require("../renderLaTeXAsHTML"));

var _CustomButton = _interopRequireDefault(require("../CustomButton"));

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MathQuillEditorSymbolsPanel extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_renderButton", symbol => {
      const {
        label,
        latex,
        description
      } = symbol;
      const html = (0, _renderLaTeXAsHTML.default)(label);
      const icon = /*#__PURE__*/React.createElement("span", {
        dangerouslySetInnerHTML: {
          __html: html
        }
      });
      return /*#__PURE__*/React.createElement(_CustomButton.default, {
        className: "czi-mathquill-editor-symbols-panel-button",
        icon: icon,
        key: label + latex,
        onClick: this.props.onSelect,
        title: description,
        value: symbol
      });
    });
  }

  render() {
    const {
      title,
      symbols
    } = this.props.symbols;
    const buttons = symbols.map(this._renderButton);
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-mathquill-editor-symbols-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-mathquill-editor-symbols-panel-title"
    }, title), /*#__PURE__*/React.createElement("div", {
      className: "czi-mathquill-editor-symbols-panel-body"
    }, buttons));
  }

}

var _default = MathQuillEditorSymbolsPanel;
exports.default = _default;