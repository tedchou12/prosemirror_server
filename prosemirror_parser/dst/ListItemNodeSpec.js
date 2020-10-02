"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ATTRIBUTE_LIST_STYLE_TYPE = void 0;

var _prosemirrorModel = require("prosemirror-model");

const ATTRIBUTE_LIST_STYLE_TYPE = 'data-list-style-type';
exports.ATTRIBUTE_LIST_STYLE_TYPE = ATTRIBUTE_LIST_STYLE_TYPE;
const ALIGN_PATTERN = /(left|right|center|justify)/;

function getAttrs(dom) {
  const attrs = {};
  const {
    textAlign
  } = dom.style;
  let align = dom.getAttribute('data-align') || textAlign || '';
  align = ALIGN_PATTERN.test(align) ? align : null;

  if (align) {
    attrs.align = align;
  }

  return attrs;
}

const ListItemNodeSpec = {
  attrs: {
    align: {
      default: null
    }
  },
  // NOTE:
  // This spec does not support nested lists (e.g. `'paragraph block*'`)
  // as content because of the complexity of dealing with indentation
  // (context: https://github.com/ProseMirror/prosemirror/issues/92).
  content: 'paragraph',
  parseDOM: [{
    tag: 'li',
    getAttrs
  }],

  // NOTE:
  // This method only defines the minimum HTML attributes needed when the node
  // is serialized to HTML string. Usually this is called when user copies
  // the node to clipboard.
  // The actual DOM rendering logic is defined at `src/ui/ListItemNodeView.js`.
  toDOM(node) {
    const attrs = {};
    const {
      align
    } = node.attrs;

    if (align) {
      attrs['data-align'] = align;
    }

    return ['li', attrs, 0];
  }

};
var _default = ListItemNodeSpec;
exports.default = _default;