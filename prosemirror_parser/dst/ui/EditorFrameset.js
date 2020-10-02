"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FRAMESET_BODY_CLASSNAME = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const FRAMESET_BODY_CLASSNAME = 'czi-editor-frame-body';
exports.FRAMESET_BODY_CLASSNAME = FRAMESET_BODY_CLASSNAME;

function toCSS(val) {
  if (!val || val === 'auto') {
    // '', 0, null, false, 'auto' are all treated as undefined
    // instead of auto...
    return undefined;
  }

  if (isNaN(val)) {
    return `${val}`;
  }

  return `${val}px`;
}

class EditorFrameset extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);
  }

  render() {
    const {
      body,
      className,
      embedded,
      header,
      height,
      toolbarPlacement,
      toolbar,
      width
    } = this.props;
    const mainStyle = {
      width: toCSS(width),
      height: toCSS(height)
    };
    const mainClassName = (0, _classnames.default)(className, {
      'czi-editor-frameset': true,
      // Layout is fixed when either width or height is set.
      'with-fixed-layout': mainStyle.width || mainStyle.height,
      embedded: embedded
    });
    const toolbarHeader = toolbarPlacement === 'header' || !toolbarPlacement ? toolbar : null;
    const toolbarBody = toolbarPlacement === 'body' && toolbar;
    return /*#__PURE__*/React.createElement("div", {
      className: mainClassName,
      style: mainStyle
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-frame-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-frame-head"
    }, header, toolbarHeader), /*#__PURE__*/React.createElement("div", {
      className: FRAMESET_BODY_CLASSNAME
    }, toolbarBody, /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-frame-body-scroll"
    }, body)), /*#__PURE__*/React.createElement("div", {
      className: "czi-editor-frame-footer"
    })));
  }

}

var _default = EditorFrameset;
exports.default = _default;