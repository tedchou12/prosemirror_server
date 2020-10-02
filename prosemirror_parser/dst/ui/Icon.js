"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _canUseCSSFont = _interopRequireDefault(require("./canUseCSSFont"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const VALID_CHARS = /[a-z_]+/;
const cached = {};
const CSS_CDN_URL = '//fonts.googleapis.com/icon?family=Material+Icons';
const CSS_FONT = 'Material Icons';

(async function () {
  // Inject CSS Fonts reuqired for toolbar icons.
  const fontSupported = await (0, _canUseCSSFont.default)(CSS_FONT);

  if (!fontSupported) {
    console.info('Add CSS from ', CSS_CDN_URL); // [FS] IRAD-1061 2020-09-19
    // Now loaded locally, so that it work in closed network as well.
    //injectStyleSheet(CSS_CDN_URL);
  }
})();

class SuperscriptIcon extends React.PureComponent {
  render() {
    return /*#__PURE__*/React.createElement("span", {
      className: "superscript-wrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: "superscript-base"
    }, "x"), /*#__PURE__*/React.createElement("span", {
      className: "superscript-top"
    }, "y"));
  }

}

class SubscriptIcon extends React.PureComponent {
  render() {
    return /*#__PURE__*/React.createElement("span", {
      className: "subscript-wrap"
    }, /*#__PURE__*/React.createElement("span", {
      className: "subscript-base"
    }, "x"), /*#__PURE__*/React.createElement("span", {
      className: "subscript-bottom"
    }, "y"));
  }

}

class Icon extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);
  }

  // Get the static Icon.
  static get(type, title) {
    const key = `${type || ''}-${title || ''}`;
    const icon = cached[key] || /*#__PURE__*/React.createElement(Icon, {
      title: title,
      type: type
    });
    cached[key] = icon;
    return icon;
  }

  render() {
    const {
      type,
      title
    } = this.props;
    let className = '';
    let children = '';

    if (type == 'superscript') {
      className = (0, _classnames.default)('czi-icon', {
        [type]: true
      });
      children = /*#__PURE__*/React.createElement(SuperscriptIcon, null);
    } else if (type == 'subscript') {
      className = (0, _classnames.default)('czi-icon', {
        [type]: true
      });
      children = /*#__PURE__*/React.createElement(SubscriptIcon, null);
    } else if (!type || !VALID_CHARS.test(type)) {
      className = (0, _classnames.default)('czi-icon-unknown');
      children = title || type;
    } else {
      className = (0, _classnames.default)('czi-icon', {
        [type]: true
      });
      children = type;
    }

    return /*#__PURE__*/React.createElement("span", {
      className: className
    }, children);
  }

}

var _default = Icon;
exports.default = _default;