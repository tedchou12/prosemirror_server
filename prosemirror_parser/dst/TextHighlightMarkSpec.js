"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _toCSSColor = require("./ui/toCSSColor");

const TextHighlightMarkSpec = {
  attrs: {
    highlightColor: ''
  },
  inline: true,
  group: 'inline',
  parseDOM: [{
    tag: 'span[style*=background-color]',
    getAttrs: dom => {
      const {
        backgroundColor
      } = dom.style;
      const color = (0, _toCSSColor.toCSSColor)(backgroundColor);
      return {
        highlightColor: (0, _toCSSColor.isTransparent)(color) ? '' : color
      };
    }
  }],

  toDOM(node) {
    const {
      highlightColor
    } = node.attrs;
    let style = '';

    if (highlightColor) {
      style += `background-color: ${highlightColor};`;
    }

    return ['span', {
      style
    }, 0];
  }

};
var _default = TextHighlightMarkSpec;
exports.default = _default;