"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _BookmarkNodeSpec = require("./../BookmarkNodeSpec");

var _CustomNodeView = _interopRequireDefault(require("./CustomNodeView"));

var _Icon = _interopRequireDefault(require("./Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BookmarkViewBody extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_onClick", e => {
      e.preventDefault();
      const {
        id
      } = this.props.node.attrs;
      const hash = '#' + id;

      if (window.location.hash !== hash) {
        window.location.hash = hash;
      }
    });
  }

  render() {
    const {
      id,
      visible
    } = this.props.node.attrs;
    const icon = id && visible ? _Icon.default.get('bookmark') : null;
    return /*#__PURE__*/React.createElement("span", {
      onClick: this._onClick
    }, icon);
  }

}

class BookmarkNodeView extends _CustomNodeView.default {
  // @override
  createDOMElement() {
    const el = document.createElement('a');
    el.className = 'czi-bookmark-view';

    this._updateDOM(el);

    return el;
  } // @override


  update(node, decorations) {
    super.update(node, decorations);
    return true;
  } // @override


  renderReactComponent() {
    return /*#__PURE__*/React.createElement(BookmarkViewBody, this.props);
  }

  _updateDOM(el) {
    const {
      id,
      visible
    } = this.props.node.attrs;
    el.setAttribute('id', id);
    el.setAttribute('title', id);
    el.setAttribute(_BookmarkNodeSpec.ATTRIBUTE_BOOKMARK_ID, id);
    visible && el.setAttribute(_BookmarkNodeSpec.ATTRIBUTE_BOOKMARK_VISIBLE, 'true');
  }

}

var _default = BookmarkNodeView;
exports.default = _default;