"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ATTRIBUTE_FOLLOWING = exports.ATTRIBUTE_COUNTER_RESET = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _ListItemNodeSpec = require("./ListItemNodeSpec");

var _NodeNames = require("./NodeNames");

var _ParagraphNodeSpec = require("./ParagraphNodeSpec");

const ATTRIBUTE_COUNTER_RESET = 'data-counter-reset';
exports.ATTRIBUTE_COUNTER_RESET = ATTRIBUTE_COUNTER_RESET;
const ATTRIBUTE_FOLLOWING = 'data-following';
exports.ATTRIBUTE_FOLLOWING = ATTRIBUTE_FOLLOWING;
const AUTO_LIST_STYLE_TYPES = ['decimal', 'lower-alpha', 'lower-roman'];
const OrderedListNodeSpec = {
  attrs: {
    id: {
      default: null
    },
    counterReset: {
      default: null
    },
    indent: {
      default: _ParagraphNodeSpec.MIN_INDENT_LEVEL
    },
    following: {
      default: null
    },
    listStyleType: {
      default: null
    },
    name: {
      default: null
    },
    start: {
      default: 1
    },
    objectId: {
      default: null
    }
  },
  group: 'block',
  content: _NodeNames.LIST_ITEM + '+',
  parseDOM: [{
    tag: 'ol',

    getAttrs(dom) {
      const listStyleType = dom.getAttribute(_ListItemNodeSpec.ATTRIBUTE_LIST_STYLE_TYPE);
      const counterReset = dom.getAttribute(ATTRIBUTE_COUNTER_RESET) || undefined;
      const start = dom.hasAttribute('start') ? parseInt(dom.getAttribute('start'), 10) : 1;
      const indent = dom.hasAttribute(_ParagraphNodeSpec.ATTRIBUTE_INDENT) ? parseInt(dom.getAttribute(_ParagraphNodeSpec.ATTRIBUTE_INDENT), 10) : _ParagraphNodeSpec.MIN_INDENT_LEVEL;
      const name = dom.getAttribute('name') || undefined;
      const following = dom.getAttribute(ATTRIBUTE_FOLLOWING) || undefined;
      const objectId = dom.getAttribute('objectId') || null;
      return {
        counterReset,
        following,
        indent,
        listStyleType,
        name,
        start,
        objectId
      };
    }

  }],

  toDOM(node) {
    const {
      start,
      indent,
      listStyleType,
      counterReset,
      following,
      name,
      objectId
    } = node.attrs;
    const attrs = {
      [_ParagraphNodeSpec.ATTRIBUTE_INDENT]: indent
    };

    if (counterReset === 'none') {
      attrs[ATTRIBUTE_COUNTER_RESET] = counterReset;
    }

    if (following) {
      attrs[ATTRIBUTE_FOLLOWING] = following;
    }

    if (listStyleType) {
      attrs[_ListItemNodeSpec.ATTRIBUTE_LIST_STYLE_TYPE] = listStyleType;
    }

    if (start !== 1) {
      attrs.start = start;
    }

    if (name) {
      attrs.name = name;
    }

    attrs.objectId = objectId;
    let htmlListStyleType = listStyleType;

    if (!htmlListStyleType || htmlListStyleType === 'decimal') {
      htmlListStyleType = AUTO_LIST_STYLE_TYPES[indent % AUTO_LIST_STYLE_TYPES.length];
    }

    const cssCounterName = `czi-counter-${indent}`;
    attrs.style = `--czi-counter-name: ${cssCounterName};` + `--czi-counter-reset: ${following ? 'none' : start - 1};` + `--czi-list-style-type: ${htmlListStyleType}`;
    attrs.type = htmlListStyleType;
    return ['ol', attrs, 0];
  }

};
var _default = OrderedListNodeSpec;
exports.default = _default;