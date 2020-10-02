"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

var _MathQuillEditor = _interopRequireDefault(require("./mathquill-editor/MathQuillEditor"));

var _preventEventDefault = _interopRequireDefault(require("./preventEventDefault"));

var _uuid = _interopRequireDefault(require("./uuid"));

var _i18n = _interopRequireDefault(require("./i18n"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MathEditor extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      initialValue: this.props.initialValue,
      value: this.props.initialValue || ''
    });

    _defineProperty(this, "_id", (0, _uuid.default)());

    _defineProperty(this, "_unmounted", false);

    _defineProperty(this, "_onChange", value => {
      this.setState({
        value
      });
    });

    _defineProperty(this, "_cancel", () => {
      this.props.close();
    });

    _defineProperty(this, "_insert", () => {
      this.props.close(this.state.value);
    });
  }

  render() {
    const {
      initialValue,
      value
    } = this.state;
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-math-editor"
    }, /*#__PURE__*/React.createElement("form", {
      className: "czi-form",
      onSubmit: _preventEventDefault.default
    }, /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, (0, _i18n.default)('Insert Math')), /*#__PURE__*/React.createElement(_MathQuillEditor.default, {
      onChange: this._onChange,
      value: value
    })), /*#__PURE__*/React.createElement("div", {
      className: "czi-form-buttons"
    }, /*#__PURE__*/React.createElement(_CustomButton.default, {
      label: (0, _i18n.default)('Cancel'),
      onClick: this._cancel
    }), /*#__PURE__*/React.createElement(_CustomButton.default, {
      active: true,
      disabled: !this.state.value,
      label: initialValue ? (0, _i18n.default)('Update') : (0, _i18n.default)('Insert'),
      onClick: this._insert
    }))));
  }

}

_defineProperty(MathEditor, "propsTypes", {
  initialValue: _propTypes.default.string,
  close: function (props, propName) {
    var fn = props[propName];

    if (!fn.prototype || typeof fn.prototype.constructor !== 'function' && fn.prototype.constructor.length !== 1) {
      return new Error(propName + 'must be a function with 1 arg of type string');
    }
  }
});

var _default = MathEditor;
exports.default = _default;