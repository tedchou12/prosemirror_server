"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = joinUp;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

// https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js
// Join the selected block or, if there is a text selection, the
// closest ancestor block of the selection that can be joined, with
// the sibling above it.
function joinUp(tr) {
  const sel = tr.selection;
  const nodeSel = sel instanceof _prosemirrorState.NodeSelection;
  let point;

  if (nodeSel) {
    if (sel.node.isTextblock || !(0, _prosemirrorTransform.canJoin)(tr.doc, sel.from)) {
      return tr;
    }

    point = sel.from;
  } else {
    point = (0, _prosemirrorTransform.joinPoint)(tr.doc, sel.from, -1);

    if (point === null || point === undefined) {
      return tr;
    }
  }

  tr = tr.join(point);

  if (nodeSel) {
    tr = tr.setSelection(_prosemirrorState.NodeSelection.create(tr.doc, point - tr.doc.resolve(point).nodeBefore.nodeSize));
  }

  return tr;
}