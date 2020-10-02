"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ImageAlignValues = {
  NONE: {
    value: null,
    text: 'Inline'
  },
  LEFT: {
    value: 'left',
    text: 'Float left'
  },
  CENTER: {
    value: 'center',
    text: 'Break text'
  },
  RIGHT: {
    value: 'right',
    text: 'Float right'
  }
};

class ImageInlineEditor extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_onClick", align => {
      this.props.onSelect({
        align: align
      });
    });
  }

  render() {
    const align = this.props.value ? this.props.value.align : null;
    const onClick = this._onClick;
    const buttons = Object.keys(ImageAlignValues).map(key => {
      const {
        value,
        text
      } = ImageAlignValues[key];
      return /*#__PURE__*/React.createElement(_CustomButton.default, {
        active: align === value,
        key: key,
        label: text,
        onClick: onClick,
        value: value
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-inline-editor"
    }, buttons);
  }

}

var _default = ImageInlineEditor;
exports.default = _default;