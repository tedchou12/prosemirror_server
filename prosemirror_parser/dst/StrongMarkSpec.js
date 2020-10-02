"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const STRONG_DOM = ['strong', 0];
const CSS_BOLD_PATTERN = /^(bold(er)?|[5-9]\d{2,})$/;
const StrongMarkSpec = {
  parseDOM: [{
    tag: 'strong'
  }, // This works around a Google Docs misbehavior where
  // pasted content will be inexplicably wrapped in `<b>`
  // tags with a font-weight normal.
  {
    tag: 'b',
    getAttrs: node => node.style.fontWeight != 'normal' && null
  }, {
    style: 'font-weight',
    getAttrs: value => CSS_BOLD_PATTERN.test(value) && null
  }],

  toDOM() {
    return STRONG_DOM;
  }

};
var _default = StrongMarkSpec;
exports.default = _default;