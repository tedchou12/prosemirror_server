"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const TextSubMarkSpec = {
  parseDOM: [{
    tag: 'sub'
  }, {
    style: 'vertical-align',
    getAttrs: value => {
      return value === 'sub' && null;
    }
  }],

  toDOM() {
    return ['sub', 0];
  }

};
var _default = TextSubMarkSpec;
exports.default = _default;