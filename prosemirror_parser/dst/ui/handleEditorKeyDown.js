"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleEditorKeyDown;

var _prosemirrorView = require("prosemirror-view");

var _KeyCodes = require("./KeyCodes");

const AtomicNodeKeyCodes = new Set([_KeyCodes.BACKSPACE, _KeyCodes.DELETE, _KeyCodes.DOWN_ARROW, _KeyCodes.LEFT_ARROW, _KeyCodes.RIGHT_ARROW, _KeyCodes.UP_ARROW]);

function handleEditorKeyDown(view, event) {
  const {
    selection,
    tr
  } = view.state;
  const {
    from,
    to
  } = selection;

  if (from === to - 1) {
    const node = tr.doc.nodeAt(from);

    if (node.isAtom && !node.isText && node.isLeaf) {
      // An atomic node (e.g. Image) is selected.
      // Only whitelisted keyCode should be allowed, which prevents user
      // from typing letter after the atomic node selected.
      return !AtomicNodeKeyCodes.has(event.keyCode);
    }
  }

  return false;
}