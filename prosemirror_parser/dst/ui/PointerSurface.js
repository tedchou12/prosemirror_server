"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _preventEventDefault = _interopRequireDefault(require("./preventEventDefault"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PointerSurface extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_clicked", false);

    _defineProperty(this, "_mul", false);

    _defineProperty(this, "_pressedTarget", null);

    _defineProperty(this, "_unmounted", false);

    _defineProperty(this, "state", {
      pressed: false
    });

    _defineProperty(this, "_onMouseEnter", e => {
      this._pressedTarget = null;
      e.preventDefault();
      const {
        onMouseEnter,
        value
      } = this.props;
      onMouseEnter && onMouseEnter(value, e);
    });

    _defineProperty(this, "_onMouseLeave", e => {
      this._pressedTarget = null;
      const mouseUpEvent = e;

      this._onMouseUpCapture(mouseUpEvent);
    });

    _defineProperty(this, "_onMouseDown", e => {
      e.preventDefault();
      this._pressedTarget = null;
      this._clicked = false;

      if (e.which === 3 || e.button == 2) {
        // right click.
        return;
      }

      this.setState({
        pressed: true
      });
      this._pressedTarget = e.currentTarget;
      this._clicked = false;

      if (!this._mul) {
        document.addEventListener('mouseup', this._onMouseUpCapture, true);
        this._mul = true;
      }
    });

    _defineProperty(this, "_onMouseUp", e => {
      e.preventDefault();

      if (this._clicked || e.type === 'keypress') {
        const {
          onClick,
          value,
          disabled
        } = this.props;
        !disabled && onClick && onClick(value, e);
      }

      this._pressedTarget = null;
      this._clicked = false;
    });

    _defineProperty(this, "_onMouseUpCapture", e => {
      if (this._mul) {
        this._mul = false;
        document.removeEventListener('mouseup', this._onMouseUpCapture, true);
      }

      const target = e.target;
      this._clicked = this._pressedTarget instanceof HTMLElement && target instanceof HTMLElement && (target === this._pressedTarget || target.contains(this._pressedTarget) || this._pressedTarget.contains(target));
      this.setState({
        pressed: false
      });
    });
  }

  render() {
    const {
      className,
      disabled,
      active,
      id,
      style,
      title,
      children
    } = this.props;
    const {
      pressed
    } = this.state;
    const buttonClassName = (0, _classnames.default)(className, {
      active: active,
      disabled: disabled,
      pressed: pressed
    });
    return /*#__PURE__*/React.createElement("span", {
      "aria-disabled": disabled,
      "aria-pressed": pressed,
      className: buttonClassName,
      disabled: disabled,
      id: id,
      onKeyPress: disabled ? _preventEventDefault.default : this._onMouseUp,
      onMouseDown: disabled ? _preventEventDefault.default : this._onMouseDown,
      onMouseEnter: disabled ? _preventEventDefault.default : this._onMouseEnter,
      onMouseLeave: disabled ? null : this._onMouseLeave,
      onMouseUp: disabled ? _preventEventDefault.default : this._onMouseUp,
      role: "button",
      style: style,
      tabIndex: disabled ? null : 0,
      title: title
    }, children);
  }

  componentWillUnmount() {
    this._unmounted = true;

    if (this._mul) {
      this._mul = false;
      document.removeEventListener('mouseup', this._onMouseUpCapture, true);
    }
  }

}

var _default = PointerSurface;
exports.default = _default;