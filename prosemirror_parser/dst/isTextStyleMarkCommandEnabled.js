"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isTextStyleMarkCommandEnabled;

var _isNodeSelectionForNodeType = _interopRequireDefault(require("./isNodeSelectionForNodeType"));

var _prosemirrorState = require("prosemirror-state");

var _NodeNames = require("./NodeNames");

var _MarkNames = require("./MarkNames");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const VALID_MATH_MARK_NAMES = new Set([_MarkNames.MARK_FONT_SIZE, _MarkNames.MARK_TEXT_COLOR]); // Whether the command for apply specific text style mark is enabled.

function isTextStyleMarkCommandEnabled(state, markName) {
  const {
    selection,
    schema,
    tr
  } = state;
  const markType = schema.marks[markName];

  if (!markType) {
    return false;
  }

  const mathNodeType = schema.nodes[_NodeNames.MATH];

  if (mathNodeType && VALID_MATH_MARK_NAMES.has(markName) && (0, _isNodeSelectionForNodeType.default)(selection, mathNodeType)) {
    // A math node is selected.
    return true;
  }

  if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
    // Could be a NodeSelection or CellSelection.
    return false;
  }

  const {
    from,
    to
  } = state.selection;

  if (to === from + 1) {
    const node = tr.doc.nodeAt(from);

    if (node.isAtom && !node.isText && node.isLeaf) {
      // An atomic node (e.g. Image) is selected.
      return false;
    }
  }

  return true;
}