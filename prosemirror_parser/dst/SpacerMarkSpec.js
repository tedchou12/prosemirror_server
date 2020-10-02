"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HAIR_SPACE_CHAR = exports.SPACER_SIZE_TAB_LARGE = exports.SPACER_SIZE_TAB = exports.DOM_ATTRIBUTE_SIZE = void 0;

var _prosemirrorModel = require("prosemirror-model");

const DOM_ATTRIBUTE_SIZE = 'data-spacer-size';
exports.DOM_ATTRIBUTE_SIZE = DOM_ATTRIBUTE_SIZE;
const SPACER_SIZE_TAB = 'tab';
exports.SPACER_SIZE_TAB = SPACER_SIZE_TAB;
const SPACER_SIZE_TAB_LARGE = 'tab-large'; // See http://jkorpela.fi/chars/spaces.html

exports.SPACER_SIZE_TAB_LARGE = SPACER_SIZE_TAB_LARGE;
const HAIR_SPACE_CHAR = '\u200A';
exports.HAIR_SPACE_CHAR = HAIR_SPACE_CHAR;
const SpacerMarkSpec = {
  attrs: {
    size: {
      default: SPACER_SIZE_TAB
    }
  },
  defining: true,
  draggable: false,
  excludes: '_',
  group: 'inline',
  inclusive: false,
  inline: true,
  spanning: false,
  parseDOM: [{
    tag: `span[${DOM_ATTRIBUTE_SIZE}]`,
    getAttrs: el => {
      return {
        size: el.getAttribute(DOM_ATTRIBUTE_SIZE) || SPACER_SIZE_TAB
      };
    }
  }],

  toDOM(node) {
    const {
      size
    } = node.attrs;
    return ['span', {
      [DOM_ATTRIBUTE_SIZE]: size
    }, 0];
  }

};
var _default = SpacerMarkSpec;
exports.default = _default;