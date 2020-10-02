"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const TextSuperMarkSpec = {
  parseDOM: [{
    tag: 'sup'
  }, {
    style: 'vertical-align',
    getAttrs: value => {
      return value === 'super' && null;
    }
  }],

  toDOM() {
    return ['sup', 0];
  }

};
var _default = TextSuperMarkSpec;
exports.default = _default;