"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _isEditorStateEmpty = _interopRequireDefault(require("./isEditorStateEmpty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const CLASS_NAME_HAS_PLACEHOLDER = 'czi-has-placeholder';

class ContentPlaceholderView {
  constructor(editorView) {
    _defineProperty(this, "_el", null);

    _defineProperty(this, "_focused", null);

    _defineProperty(this, "_view", null);

    _defineProperty(this, "_visible", null);

    _defineProperty(this, "_checkFocus", () => {
      const el = this._el;
      const view = this._view;

      if (!view || !el) {
        return;
      }

      const doc = document;
      const activeElement = doc.activeElement;

      const bodyEl = this._getBodyElement();

      if (!activeElement || !bodyEl || doc.hasFocus && !doc.hasFocus()) {
        this._onBlur();
      } else {
        if (activeElement === bodyEl || bodyEl.contains(activeElement) || activeElement === bodyEl.parentNode) {
          this._onFocus();
        } else {
          this._onBlur();
        }
      }
    });

    const _el = document.createElement('div');

    this._el = _el;
    this._view = editorView;
    _el.className = 'czi-editor-content-placeholder';
    editorView.dom.parentNode.appendChild(_el);
    document.addEventListener('focusin', this._checkFocus, true);
    document.addEventListener('focusout', this._checkFocus, false);
    this.update(editorView); // We don't know whether view is focused at this moment yet. Manually
    // calls `this._checkFocus` which will set `_focused` accordingly.

    this._checkFocus();
  }

  update(view) {
    this._view = view;
    const el = this._el;

    if (!el || !view) {
      return;
    }

    if (this._focused || !(0, _isEditorStateEmpty.default)(view.state)) {
      this._hide();

      return;
    }

    const parentEl = el.parentNode;

    const bodyEl = this._getBodyElement();

    const placeholder = view.placeholder;

    if (!parentEl || !bodyEl || !placeholder) {
      return;
    }

    this._visible = true;
    view.dom.classList.add(CLASS_NAME_HAS_PLACEHOLDER);
    const parentElRect = parentEl.getBoundingClientRect();
    const bodyRect = bodyEl.getBoundingClientRect();
    const bodyStyle = window.getComputedStyle(bodyEl);
    const left = bodyRect.left - parentElRect.left;
    const top = bodyRect.top - parentElRect.top;
    el.style.left = left + 'px';
    el.style.top = top + 'px';
    el.style.padding = bodyStyle.padding;
    el.style.display = 'block';
    el.style.width = bodyEl.offsetWidth + 'px';

    _reactDom.default.render( /*#__PURE__*/React.createElement("div", null, placeholder), el);
  }

  destroy() {
    this._hide();

    const el = this._el;

    if (el) {
      el.parentNode && el.parentNode.removeChild(el);

      _reactDom.default.unmountComponentAtNode(el);
    }

    document.removeEventListener('focusin', this._checkFocus, true);
    document.removeEventListener('focusout', this._checkFocus, false);
    this._view = null;
    this._el = null;
    this._focused = false;
    this._visible = false;
  }

  _onFocus() {
    if (this._focused !== true) {
      this._focused = true;

      this._hide();
    }
  }

  _onBlur() {
    const view = this._view;

    if (this._focused !== false) {
      this._focused = false;

      if (view && (0, _isEditorStateEmpty.default)(view.state)) {
        this._show();
      } else {
        this._hide();
      }
    }
  }

  _getBodyElement() {
    const view = this._view;
    return view && view.docView && view.docView.dom && view.docView.dom.firstChild;
  }

  _show() {
    if (this._visible !== true) {
      const el = this._el;
      const view = this._view;
      this._visible = true;

      if (el) {
        el.style.display = 'block';
      }

      if (view) {
        this.update(view);
        view.dom.classList.add(CLASS_NAME_HAS_PLACEHOLDER);
      }
    }
  }

  _hide() {
    if (this._visible !== false) {
      const el = this._el;
      const view = this._view;
      this._visible = false;

      if (el) {
        el.style.display = 'none';
      }

      if (view) {
        view.dom.classList.remove(CLASS_NAME_HAS_PLACEHOLDER);
      }
    }
  }

}

class ContentPlaceholderPlugin extends _prosemirrorState.Plugin {
  constructor() {
    super({
      // [FS] IRAD-1005 2020-07-07
      // Upgrade outdated packages.    
      key: new _prosemirrorState.PluginKey('ContentPlaceholderPlugin'),

      view(editorView) {
        return new ContentPlaceholderView(editorView);
      }

    });
  }

}

var _default = ContentPlaceholderPlugin;
exports.default = _default;