"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

var _preventEventDefault = _interopRequireDefault(require("./preventEventDefault"));

var _resolveImage = _interopRequireDefault(require("./resolveImage"));

var _i18n = _interopRequireDefault(require("./i18n"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ImageURLEditor extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_img", null);

    _defineProperty(this, "_unmounted", false);

    _defineProperty(this, "state", { ...(this.props.initialValue || {}),
      validValue: null
    });

    _defineProperty(this, "_onSrcChange", e => {
      const src = e.target.value;
      this.setState({
        src,
        validValue: null
      }, this._didSrcChange);
    });

    _defineProperty(this, "_didSrcChange", () => {
      (0, _resolveImage.default)(this.state.src).then(result => {
        if (this.state.src === result.src && !this._unmounted) {
          const validValue = result.complete ? result : null;
          this.setState({
            validValue
          });
        }
      });
    });

    _defineProperty(this, "_cancel", () => {
      this.props.close();
    });

    _defineProperty(this, "_insert", () => {
      const {
        validValue
      } = this.state;
      this.props.close(validValue);
    });
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const {
      src,
      validValue
    } = this.state;
    const preview = validValue ? /*#__PURE__*/React.createElement("div", {
      className: "czi-image-url-editor-input-preview",
      style: {
        backgroundImage: `url(${String(validValue.src)}`
      }
    }) : null;
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-image-url-editor"
    }, /*#__PURE__*/React.createElement("form", {
      className: "czi-form",
      onSubmit: _preventEventDefault.default
    }, /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, (0, _i18n.default)('Insert Image')), /*#__PURE__*/React.createElement("div", {
      className: "czi-image-url-editor-src-input-row"
    }, /*#__PURE__*/React.createElement("input", {
      autoFocus: true,
      className: "czi-image-url-editor-src-input",
      onChange: this._onSrcChange,
      placeholder: (0, _i18n.default)("Type Something..."),
      type: "text",
      value: src || ''
    }), preview), /*#__PURE__*/React.createElement("em", null, (0, _i18n.default)('Only select image that you have confirmed the license to use'))), /*#__PURE__*/React.createElement("div", {
      className: "czi-form-buttons"
    }, /*#__PURE__*/React.createElement(_CustomButton.default, {
      label: (0, _i18n.default)('Cancel'),
      onClick: this._cancel
    }), /*#__PURE__*/React.createElement(_CustomButton.default, {
      active: !!validValue,
      disabled: !validValue,
      label: (0, _i18n.default)('Insert'),
      onClick: this._insert
    }))));
  }

}

_defineProperty(ImageURLEditor, "propsTypes", {
  initialValue: _propTypes.default.object,
  close: function (props, propName) {
    var fn = props[propName];

    if (!fn.prototype || typeof fn.prototype.constructor !== 'function' && fn.prototype.constructor.length !== 1) {
      return new Error(propName + 'must be a function with 1 arg of type ImageLike');
    }
  }
});

var _default = ImageURLEditor;
exports.default = _default;