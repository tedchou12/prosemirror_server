"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _toClosestFontPtSize = require("./toClosestFontPtSize");

const FontSizeMarkSpec = {
  attrs: {
    pt: {
      default: null
    }
  },
  inline: true,
  group: 'inline',
  parseDOM: [{
    style: 'font-size',
    getAttrs: getAttrs
  }],

  toDOM(node) {
    const {
      pt
    } = node.attrs;
    const domAttrs = pt ? {
      style: `font-size: ${pt}pt;`,
      class: 'czi-font-size-mark'
    } : null;
    return ['span', domAttrs, 0];
  }

};

function getAttrs(fontSize) {
  const attrs = {};

  if (!fontSize) {
    return attrs;
  }

  const ptValue = (0, _toClosestFontPtSize.toClosestFontPtSize)(fontSize);

  if (!ptValue) {
    return attrs;
  }

  return {
    pt: ptValue
  };
}

var _default = FontSizeMarkSpec;
exports.default = _default;