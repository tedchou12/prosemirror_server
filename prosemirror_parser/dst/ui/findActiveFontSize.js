"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findActiveFontSize;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _MarkNames = require("../MarkNames");

var _NodeNames = require("../NodeNames");

var _findActiveMark = _interopRequireDefault(require("../findActiveMark"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This should map to `--czi-content-font-size` at `czi-editor.css`.
const FONT_PT_SIZE_DEFAULT = 11; // This should map to `czi-heading.css`.

const MAP_HEADING_LEVEL_TO_FONT_PT_SIZE = {
  '1': 20,
  '2': 18,
  '3': 16,
  '4': 14,
  '5': 11,
  '6': 11
};

function findActiveFontSize(state) {
  const {
    schema,
    doc,
    selection,
    tr
  } = state;
  const markType = schema.marks[_MarkNames.MARK_FONT_SIZE];
  const heading = schema.nodes[_NodeNames.HEADING];
  const defaultSize = String(FONT_PT_SIZE_DEFAULT);

  if (!markType) {
    return defaultSize;
  }

  const {
    from,
    to,
    empty
  } = selection;

  if (empty) {
    const storedMarks = tr.storedMarks || state.storedMarks || selection.$cursor && selection.$cursor.marks && selection.$cursor.marks() || [];
    const sm = storedMarks.find(m => m.type === markType);
    return sm ? String(sm.attrs.pt || defaultSize) : defaultSize;
  }

  const mark = markType ? (0, _findActiveMark.default)(doc, from, to, markType) : null;

  if (mark) {
    return String(mark.attrs.pt);
  }

  if (!heading) {
    return defaultSize;
  }

  const result = (0, _prosemirrorUtils.findParentNodeOfType)(heading)(state.selection);

  if (!result) {
    return defaultSize;
  }

  const level = String(result.node.attrs.level);
  return MAP_HEADING_LEVEL_TO_FONT_PT_SIZE[level] || defaultSize;
}