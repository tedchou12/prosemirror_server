"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const NO_WRAP_DOM = ['nobr', 0];
const TextNoWrapMarkSpec = {
  parseDOM: [{
    tag: 'nobr'
  }],

  toDOM() {
    return NO_WRAP_DOM;
  }

};
var _default = TextNoWrapMarkSpec;
exports.default = _default;