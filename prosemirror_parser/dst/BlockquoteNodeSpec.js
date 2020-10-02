"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _ParagraphNodeSpec = _interopRequireWildcard(require("./ParagraphNodeSpec"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
const BlockquoteNodeSpec = { ..._ParagraphNodeSpec.default,
  defining: true,
  parseDOM: [{
    tag: 'blockquote',
    getAttrs
  }],
  toDOM
};

function toDOM(node) {
  const dom = (0, _ParagraphNodeSpec.toParagraphDOM)(node);
  dom[0] = 'blockquote';
  return dom;
}

function getAttrs(dom) {
  return (0, _ParagraphNodeSpec.getParagraphNodeAttrs)(dom);
}

var _default = BlockquoteNodeSpec;
exports.default = _default;