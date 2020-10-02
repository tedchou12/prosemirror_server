"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchParagraphElements;

var _ParagraphNodeSpec = require("./ParagraphNodeSpec");

function patchParagraphElements(doc) {
  Array.from(doc.querySelectorAll('p')).forEach(patchParagraphElement);
}

function patchParagraphElement(pElement) {
  const {
    marginLeft
  } = pElement.style;

  if (marginLeft) {
    const indent = (0, _ParagraphNodeSpec.convertMarginLeftToIndentValue)(marginLeft);

    if (indent) {
      pElement.setAttribute(_ParagraphNodeSpec.ATTRIBUTE_INDENT, String(indent));
    }
  }
}