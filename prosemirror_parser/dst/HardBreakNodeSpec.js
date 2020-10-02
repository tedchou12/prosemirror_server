"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const BR_DOM = ['br'];
const HardBreakNodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  parseDOM: [{
    tag: 'br'
  }],

  toDOM() {
    return BR_DOM;
  }

};
var _default = HardBreakNodeSpec;
exports.default = _default;