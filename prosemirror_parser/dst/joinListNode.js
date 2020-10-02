"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = joinListNode;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _isListNode = _interopRequireDefault(require("./isListNode"));

var _joinDown = _interopRequireDefault(require("./joinDown"));

var _joinUp = _interopRequireDefault(require("./joinUp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function joinListNode(tr, schema, listNodePos) {
  if (!tr.doc || !tr.selection) {
    return tr;
  }

  const node = tr.doc.nodeAt(listNodePos);

  if (!(0, _isListNode.default)(node)) {
    return tr;
  }

  const initialSelection = tr.selection;
  const listFromPos = listNodePos;
  const listToPos = listFromPos + node.nodeSize;
  const $fromPos = tr.doc.resolve(listFromPos);
  const $toPos = tr.doc.resolve(listToPos);
  let selectionOffset = 0;

  if ($toPos.nodeAfter && $toPos.nodeAfter.type === node.type && $toPos.nodeAfter.attrs.level === node.attrs.level) {
    tr = (0, _joinDown.default)(tr);
  }

  if ($fromPos.nodeBefore && $fromPos.nodeBefore.type === node.type && $fromPos.nodeBefore.attrs.level === node.attrs.level) {
    selectionOffset -= 2;
    tr = (0, _joinUp.default)(tr);
  }

  const selection = _prosemirrorState.TextSelection.create(tr.doc, initialSelection.from + selectionOffset, initialSelection.to + selectionOffset);

  tr = tr.setSelection(selection);
  return tr;
}