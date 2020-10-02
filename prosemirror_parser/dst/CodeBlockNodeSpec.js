"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const PRE_DOM = ['pre', ['code', 0]]; // https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A code listing. Disallows marks or non-text inline
// nodes by default. Represented as a `<pre>` element with a
// `<code>` element inside of it.

const CodeBlockNodeSpec = {
  attrs: {
    id: {
      default: null
    }
  },
  content: 'inline*',
  group: 'block',
  marks: '_',
  code: true,
  defining: true,
  parseDOM: [{
    tag: 'pre',
    preserveWhitespace: 'full'
  }],

  toDOM() {
    return PRE_DOM;
  }

};
var _default = CodeBlockNodeSpec;
exports.default = _default;