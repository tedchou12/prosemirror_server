"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ATTRIBUTE_BOOKMARK_VISIBLE = exports.ATTRIBUTE_BOOKMARK_ID = void 0;
const ATTRIBUTE_BOOKMARK_ID = 'data-bookmark-id';
exports.ATTRIBUTE_BOOKMARK_ID = ATTRIBUTE_BOOKMARK_ID;
const ATTRIBUTE_BOOKMARK_VISIBLE = 'data-bookmark-visible';
exports.ATTRIBUTE_BOOKMARK_VISIBLE = ATTRIBUTE_BOOKMARK_VISIBLE;

function getAttrs(dom) {
  const id = dom.getAttribute(ATTRIBUTE_BOOKMARK_ID);
  const visible = dom.getAttribute(ATTRIBUTE_BOOKMARK_VISIBLE) === 'true';
  return {
    id,
    visible
  };
}

const BookmarkNodeSpec = {
  inline: true,
  attrs: {
    id: {
      default: null
    },
    visible: {
      default: null
    }
  },
  group: 'inline',
  draggable: true,
  parseDOM: [{
    tag: `a[${ATTRIBUTE_BOOKMARK_ID}]`,
    getAttrs
  }],

  toDOM(node) {
    const {
      id,
      visible
    } = node.attrs;
    const attrs = id ? {
      [ATTRIBUTE_BOOKMARK_ID]: id,
      [ATTRIBUTE_BOOKMARK_VISIBLE]: visible,
      id
    } : {};
    return ['a', attrs];
  }

};
var _default = BookmarkNodeSpec;
exports.default = _default;