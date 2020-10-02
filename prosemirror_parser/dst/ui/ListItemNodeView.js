"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorView = require("prosemirror-view");

var _MarkNames = require("../MarkNames");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// This implements the `NodeView` interface
// https://prosemirror.net/docs/ref/#view.NodeView
class ListItemNodeView {
  // This implements the `NodeView` interface
  // The outer DOM node that represents the list item element.
  // This implements the `NodeView` interface.
  // The DOM node that should hold the node's content.
  constructor(node, editorView, getPos, decorations) {
    _defineProperty(this, "dom", void 0);

    _defineProperty(this, "contentDOM", void 0);

    _defineProperty(this, "_nodeUpdated", void 0);

    const dom = document.createElement('li');
    this.dom = dom;
    this.contentDOM = dom;

    this._updateDOM(node);
  } // This implements the `NodeView` interface.


  update(node, decorations) {
    return this._updateDOM(node);
  }

  _updateDOM(node) {
    if (this._nodeUpdated === node) {
      return false;
    }

    this._nodeUpdated = node;
    const dom = this.dom; // According to `ListItemNodeSpec`, a valid list item has the following
    // structure: `li > paragraph > text`.

    const paragraph = node.firstChild;
    const initialContent = paragraph ? paragraph.firstChild : null; // This resolves the styles for the counter by examines the marks for the
    // first text node of the list item.

    const marks = initialContent && initialContent.isText && initialContent.textContent ? initialContent.marks : null;
    let cssColor;
    let cssFontSize;
    let cssText = '';

    if (Array.isArray(marks)) {
      marks.forEach(mark => {
        const {
          attrs,
          type
        } = mark;

        switch (type.name) {
          case _MarkNames.MARK_TEXT_COLOR:
            cssColor = attrs.color;
            break;

          case _MarkNames.MARK_FONT_SIZE:
            cssFontSize = attrs.pt;
            break;
        }
      });
    } // The counter of the list item is a pseudo-element that uses
    // the CSS variables (e.g `--czi-list-style-color`) for styling.
    // This defines the CSS variables scoped for the pseudo-element.
    // See `src/ui/czi-list.css` for more details.


    if (cssColor) {
      cssText += `--czi-list-style-color: ${cssColor};`;
    }

    if (cssFontSize) {
      cssText += `--czi-list-style-font-size: ${cssFontSize}pt;`;
    }

    dom.style.cssText = cssText;
    const {
      align
    } = node.attrs;

    if (align) {
      dom.setAttribute('data-align', align);
    } else {
      dom.removeAttribute('data-align');
    }

    return true;
  }

}

var _default = ListItemNodeView;
exports.default = _default;