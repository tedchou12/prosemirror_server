"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorView = require("prosemirror-view");

var _NodeNames = require("./NodeNames");

var _toggleBlockquote = _interopRequireDefault(require("./toggleBlockquote"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BlockquoteToggleCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "isActive", state => {
      const blockquote = state.schema.nodes[_NodeNames.BLOCKQUOTE];
      return !!(blockquote && (0, _prosemirrorUtils.findParentNodeOfType)(blockquote)(state.selection));
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = (0, _toggleBlockquote.default)(state.tr.setSelection(selection), schema);

      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });
  }

}

var _default = BlockquoteToggleCommand;
exports.default = _default;