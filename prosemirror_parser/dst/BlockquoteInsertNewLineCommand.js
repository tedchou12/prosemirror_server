"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorView = require("prosemirror-view");

var _NodeNames = require("./NodeNames");

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// This handles the case when user press SHIFT + ENTER key to insert a new line
// into blockquote.
function insertNewLine(tr, schema) {
  const {
    selection
  } = tr;

  if (!selection) {
    return tr;
  }

  const {
    from,
    empty
  } = selection;

  if (!empty) {
    return tr;
  }

  const br = schema.nodes[_NodeNames.HARD_BREAK];

  if (!br) {
    return tr;
  }

  const blockquote = schema.nodes[_NodeNames.BLOCKQUOTE];
  const result = (0, _prosemirrorUtils.findParentNodeOfType)(blockquote)(selection);

  if (!result) {
    return tr;
  }

  tr = tr.insert(from, _prosemirrorModel.Fragment.from(br.create()));
  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, from + 1, from + 1));
  return tr;
}

class BlockquoteInsertNewLineCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = insertNewLine(state.tr.setSelection(selection), schema);

      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });
  }

}

var _default = BlockquoteInsertNewLineCommand;
exports.default = _default;