"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _ListItemNodeSpec = require("./ListItemNodeSpec");

var _NodeNames = require("./NodeNames");

var _ParagraphNodeSpec = require("./ParagraphNodeSpec");

const AUTO_LIST_STYLE_TYPES = ['disc', 'square', 'circle'];
const BulletListNodeSpec = {
  attrs: {
    id: {
      default: null
    },
    indent: {
      default: 0
    },
    listStyleType: {
      default: null
    },
    objectId: {
      default: null
    }
  },
  group: 'block',
  content: _NodeNames.LIST_ITEM + '+',
  parseDOM: [{
    tag: 'ul',

    getAttrs(dom) {
      const listStyleType = dom.getAttribute(_ListItemNodeSpec.ATTRIBUTE_LIST_STYLE_TYPE) || null;
      const indent = dom.hasAttribute(_ParagraphNodeSpec.ATTRIBUTE_INDENT) ? parseInt(dom.getAttribute(_ParagraphNodeSpec.ATTRIBUTE_INDENT), 10) : _ParagraphNodeSpec.MIN_INDENT_LEVEL;
      const objectId = dom.getAttribute('objectId') || null;
      return {
        indent,
        listStyleType,
        objectId
      };
    }

  }],

  toDOM(node) {
    const {
      indent,
      listStyleType,
      objectId
    } = node.attrs;
    const attrs = {}; // [FS] IRAD-947 2020-05-26
    // Bullet list type changing fix

    attrs[_ParagraphNodeSpec.ATTRIBUTE_INDENT] = indent;

    if (listStyleType) {
      attrs[_ListItemNodeSpec.ATTRIBUTE_LIST_STYLE_TYPE] = listStyleType;
    }

    let htmlListStyleType = listStyleType;

    if (!htmlListStyleType || htmlListStyleType === 'disc') {
      htmlListStyleType = AUTO_LIST_STYLE_TYPES[indent % AUTO_LIST_STYLE_TYPES.length];
    }

    attrs.type = htmlListStyleType;
    attrs.objectId = objectId;
    return ['ul', attrs, 0];
  }

};
var _default = BulletListNodeSpec;
exports.default = _default;