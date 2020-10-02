"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchBreakElements;

function patchBreakElements(doc) {
  // This is a workaround to handle HTML converted from DraftJS that
  // `<div><span><br /></span><div>` becomes `<p><br /><br /></p>`.
  // Block with single `<br />` inside should be collapsed into `<p />`.
  const selector = 'div > span:only-child > br:only-child';
  Array.from(doc.querySelectorAll(selector)).forEach(patchBreakElement);
}

function patchBreakElement(brElement) {
  const {
    ownerDocument,
    parentElement
  } = brElement;

  if (!ownerDocument || !parentElement) {
    return;
  }

  const div = brElement.parentElement && brElement.parentElement.parentElement;

  if (!div) {
    return;
  }

  const pp = ownerDocument.createElement('p');
  div.parentElement && div.parentElement.replaceChild(pp, div);
}