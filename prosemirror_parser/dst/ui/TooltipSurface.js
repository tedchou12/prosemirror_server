"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _createPopUp = _interopRequireDefault(require("./createPopUp"));

var _PopUpPosition = require("./PopUpPosition");

var _uuid = _interopRequireDefault(require("./uuid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TooltipView extends React.PureComponent {
  render() {
    const {
      tooltip
    } = this.props;
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-tooltip-view czi-animation-fade-in"
    }, tooltip);
  }

}

class TooltipSurface extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_id", (0, _uuid.default)());

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_onMouseEnter", () => {
      if (!this._popUp) {
        const {
          tooltip
        } = this.props;
        this._popUp = (0, _createPopUp.default)(TooltipView, {
          tooltip
        }, {
          anchor: document.getElementById(this._id),
          onClose: this._onClose,
          position: _PopUpPosition.atAnchorBottomCenter
        });
      }
    });

    _defineProperty(this, "_onMouseLeave", () => {
      this._popUp && this._popUp.close();
      this._popUp = null;
    });

    _defineProperty(this, "_onClose", () => {
      this._popUp = null;
    });
  }

  componentWillUnmount() {
    this._popUp && this._popUp.close();
  }

  render() {
    const {
      tooltip,
      children
    } = this.props;
    return /*#__PURE__*/React.createElement("span", {
      "aria-label": tooltip,
      className: "czi-tooltip-surface",
      "data-tooltip": tooltip,
      id: this._id,
      onMouseDown: tooltip && this._onMouseLeave,
      onMouseEnter: tooltip && this._onMouseEnter,
      onMouseLeave: tooltip && this._onMouseLeave,
      role: "tooltip"
    }, children);
  }

}

var _default = TooltipSurface;
exports.default = _default;