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

var _MarkNames = require("./MarkNames");

var _NodeNames = require("./NodeNames");

var _SpacerMarkSpec = require("./SpacerMarkSpec");

var _applyMark = _interopRequireDefault(require("./applyMark"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function insertTabSpace(tr, schema) {
  const {
    selection
  } = tr;

  if (!selection.empty || !(selection instanceof _prosemirrorState.TextSelection)) {
    return tr;
  }

  const markType = schema.marks[_MarkNames.MARK_SPACER];

  if (!markType) {
    return tr;
  }

  const paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  const heading = schema.nodes[_NodeNames.HEADING];
  const listItem = schema.nodes[_NodeNames.LIST_ITEM];
  const found = listItem && (0, _prosemirrorUtils.findParentNodeOfType)(listItem)(selection) || paragraph && (0, _prosemirrorUtils.findParentNodeOfType)(paragraph)(selection) || heading && (0, _prosemirrorUtils.findParentNodeOfType)(heading)(selection);

  if (!found) {
    return tr;
  }

  const {
    from,
    to
  } = selection;

  if (found.node.type === listItem && found.pos === from - 2) {
    // Cursur is at te begin of the list-item, let the default indentation
    // behavior happen.
    return tr;
  }

  const textNode = schema.text(_SpacerMarkSpec.HAIR_SPACE_CHAR);
  tr = tr.insert(to, _prosemirrorModel.Fragment.from(textNode));
  const attrs = {
    size: _SpacerMarkSpec.SPACER_SIZE_TAB
  };
  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, to, to + 1));
  tr = (0, _applyMark.default)(tr, schema, markType, attrs);
  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, to + 1, to + 1));
  return tr;
}

class TextInsertTabSpaceCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "execute", (state, dispatch, view, event) => {
      const {
        schema,
        tr
      } = state;
      const trNext = insertTabSpace(tr, schema);

      if (trNext.docChanged) {
        dispatch && dispatch(trNext);
        return true;
      }

      return false;
    });
  }

}

var _default = TextInsertTabSpaceCommand;
exports.default = _default;