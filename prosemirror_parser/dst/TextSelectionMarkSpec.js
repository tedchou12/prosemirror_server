"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

const TextSelectionMarkSpec = {
  attrs: {
    id: ''
  },
  inline: true,
  group: 'inline',
  parseDOM: [{
    tag: 'czi-text-selection'
  }],

  toDOM(node) {
    return ['czi-text-selection', {
      class: 'czi-text-selection'
    }, 0];
  }

};
var _default = TextSelectionMarkSpec;
exports.default = _default;