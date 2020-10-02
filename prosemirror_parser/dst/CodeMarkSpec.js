"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const CODE_DOM = ['code', 0];
const CodeMarkSpec = {
  parseDOM: [{
    tag: 'code'
  }],

  toDOM() {
    return CODE_DOM;
  }

};
var _default = CodeMarkSpec;
exports.default = _default;