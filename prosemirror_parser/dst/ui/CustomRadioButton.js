"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _PointerSurface = _interopRequireDefault(require("./PointerSurface"));

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _uuid = _interopRequireDefault(require("./uuid"));

var _preventEventDefault = _interopRequireDefault(require("./preventEventDefault"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CustomRadioButton extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_name", (0, _uuid.default)());
  }

  render() {
    const {
      title,
      className,
      checked,
      label,
      inline,
      name,
      onSelect,
      disabled,
      ...pointerProps
    } = this.props;
    const klass = (0, _classnames.default)(className, 'czi-custom-radio-button', {
      checked: checked,
      inline: inline
    });
    return /*#__PURE__*/React.createElement(_PointerSurface.default, _extends({}, pointerProps, {
      className: klass,
      disabled: disabled,
      onClick: onSelect,
      title: title || label
    }), /*#__PURE__*/React.createElement("input", {
      checked: checked,
      className: "czi-custom-radio-button-input",
      disabled: disabled,
      name: name || this._name,
      onChange: _preventEventDefault.default,
      tabIndex: disabled ? null : 0,
      type: "radio"
    }), /*#__PURE__*/React.createElement("span", {
      className: "czi-custom-radio-button-icon"
    }), /*#__PURE__*/React.createElement("span", {
      className: "czi-custom-radio-button-label"
    }, label));
  }

}

var _default = CustomRadioButton;
exports.default = _default;