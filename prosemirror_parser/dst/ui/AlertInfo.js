"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AlertInfo extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_unmounted", false);

    _defineProperty(this, "state", { ...(this.props.initialValue || {}),
      validValue: null
    });

    _defineProperty(this, "_cancel", () => {
      this.props.close();
    });
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "alert"
    }, /*#__PURE__*/React.createElement("span", {
      class: "closebtn",
      onClick: this._cancel
    }, "\xD7"), /*#__PURE__*/React.createElement("strong", null, "Document Error!"), " Unable to load the document.", /*#__PURE__*/React.createElement("span", null, " Have issues in Json format, please verify..."));
  }

}

_defineProperty(AlertInfo, "propsTypes", {
  initialValue: _propTypes.default.object,
  close: function (props, propName) {
    var fn = props[propName];

    if (!fn.prototype || typeof fn.prototype.constructor !== 'function' && fn.prototype.constructor.length !== 1) {
      return new Error(propName + 'must be a function with 1 arg of type ImageLike');
    }
  }
});

var _default = AlertInfo;
exports.default = _default;