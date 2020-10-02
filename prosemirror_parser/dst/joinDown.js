"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = joinDown;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

// https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js
// Join the selected block, or the closest ancestor of the selection
// that can be joined, with the sibling after it.
function joinDown(tr) {
  const sel = tr.selection;
  let point;

  if (sel instanceof _prosemirrorState.NodeSelection) {
    if (sel.node.isTextblock || !(0, _prosemirrorTransform.canJoin)(tr.doc, sel.to)) {
      return tr;
    }

    point = sel.to;
  } else {
    point = (0, _prosemirrorTransform.joinPoint)(tr.doc, sel.to, 1);

    if (point === null || point === undefined) {
      return tr;
    }
  }

  tr = tr.join(point);
  return tr;
}