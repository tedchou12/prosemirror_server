"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _smoothScrollIntoViewIfNeeded = _interopRequireDefault(require("smooth-scroll-into-view-if-needed"));

var _sanitizeURL = _interopRequireDefault(require("../sanitizeURL"));

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

var _i18n = _interopRequireDefault(require("./i18n"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isBookMarkHref(href) {
  return !!href && href.indexOf('#') === 0 && href.length >= 2;
}

class LinkTooltip extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_unmounted", false);

    _defineProperty(this, "state", {
      hidden: false
    });

    _defineProperty(this, "_openLink", href => {
      if (isBookMarkHref(href)) {
        const id = href.substr(1);
        const el = document.getElementById(id);

        if (el) {
          const {
            onCancel,
            editorView
          } = this.props;
          onCancel(editorView);

          (async () => {
            // https://www.npmjs.com/package/smooth-scroll-into-view-if-needed
            await (0, _smoothScrollIntoViewIfNeeded.default)(el, {
              scrollMode: 'if-needed',
              // block: 'nearest',
              // inline: 'nearest',
              behavior: 'smooth'
            });
          })();
        }

        return;
      }

      if (href) {
        window.open((0, _sanitizeURL.default)(href));
      }
    });
  }

  render() {
    const {
      href,
      editorView,
      onEdit,
      onRemove
    } = this.props; // [FS] IRAD-1013 2020-07-09
    // Change button in "Apply Link" missing in LICIT.

    return /*#__PURE__*/React.createElement("div", {
      className: "czi-link-tooltip"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-link-tooltip-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-link-tooltip-row"
    }, /*#__PURE__*/React.createElement(_CustomButton.default, {
      className: "czi-link-tooltip-href",
      label: href,
      onClick: this._openLink,
      target: "new",
      title: href,
      value: href
    }), /*#__PURE__*/React.createElement(_CustomButton.default, {
      label: (0, _i18n.default)('Change'),
      onClick: onEdit,
      value: editorView
    }), /*#__PURE__*/React.createElement(_CustomButton.default, {
      label: (0, _i18n.default)('Remove'),
      onClick: onRemove,
      value: editorView
    }))));
  }

}

var _default = LinkTooltip;
exports.default = _default;