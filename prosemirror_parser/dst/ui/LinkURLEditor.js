"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _sanitizeURL = _interopRequireDefault(require("../sanitizeURL"));

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

var _KeyCodes = require("./KeyCodes");

var _preventEventDefault = _interopRequireDefault(require("./preventEventDefault"));

var _i18n = _interopRequireDefault(require("./i18n"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const BAD_CHARACTER_PATTER = /\s/;

class LinkURLEditor extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      url: this.props.href
    });

    _defineProperty(this, "_onKeyDown", e => {
      if (e.keyCode === _KeyCodes.ENTER) {
        e.preventDefault();

        this._apply();
      }
    });

    _defineProperty(this, "_onURLChange", e => {
      const url = e.target.value;
      this.setState({
        url
      });
    });

    _defineProperty(this, "_cancel", () => {
      this.props.close();
    });

    _defineProperty(this, "_apply", () => {
      const {
        url
      } = this.state;

      if (url && !BAD_CHARACTER_PATTER.test(url)) {
        this.props.close((0, _sanitizeURL.default)(url));
      }
    });
  }

  render() {
    const {
      href
    } = this.props;
    const {
      url
    } = this.state;
    const error = url ? BAD_CHARACTER_PATTER.test(url) : false;
    let label = 'Apply';
    let disabled = !!error;

    if (href) {
      label = url ? (0, _i18n.default)('Apply') : (0, _i18n.default)('Remove');
      disabled = error;
    } else {
      disabled = error || !url;
    }

    return /*#__PURE__*/React.createElement("div", {
      className: "czi-image-url-editor"
    }, /*#__PURE__*/React.createElement("form", {
      className: "czi-form",
      onSubmit: _preventEventDefault.default
    }, /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, (0, _i18n.default)('Add a Link')), /*#__PURE__*/React.createElement("input", {
      autoFocus: true,
      onChange: this._onURLChange,
      onKeyDown: this._onKeyDown,
      placeholder: (0, _i18n.default)("Paste a URL"),
      spellCheck: false,
      type: "text",
      value: url || ''
    })), /*#__PURE__*/React.createElement("div", {
      className: "czi-form-buttons"
    }, /*#__PURE__*/React.createElement(_CustomButton.default, {
      label: (0, _i18n.default)('Cancel'),
      onClick: this._cancel
    }), /*#__PURE__*/React.createElement(_CustomButton.default, {
      active: true,
      disabled: disabled,
      label: label,
      onClick: this._apply
    }))));
  }

}

_defineProperty(LinkURLEditor, "propsTypes", {
  href: _propTypes.default.string,
  close: function (props, propName) {
    var fn = props[propName];

    if (!fn.prototype || typeof fn.prototype.constructor !== 'function' && fn.prototype.constructor.length !== 1) {
      return new Error(propName + 'must be a function with 1 arg of type string');
    }
  }
});

var _default = LinkURLEditor;
exports.default = _default;