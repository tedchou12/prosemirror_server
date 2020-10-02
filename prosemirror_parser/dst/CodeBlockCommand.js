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

var _noop = _interopRequireDefault(require("./noop"));

var _toggleCodeBlock = _interopRequireDefault(require("./toggleCodeBlock"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CodeBlockCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "isActive", state => {
      const result = this._findCodeBlock(state);

      return !!(result && result.node);
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        selection,
        schema
      } = state;
      let {
        tr
      } = state;
      tr = tr.setSelection(selection);
      tr = (0, _toggleCodeBlock.default)(tr, schema);

      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });
  }

  _findCodeBlock(state) {
    const codeBlock = state.schema.nodes[_NodeNames.CODE_BLOCK];
    const findCodeBlock = codeBlock ? (0, _prosemirrorUtils.findParentNodeOfType)(codeBlock) : _noop.default;
    return findCodeBlock(state.selection);
  }

}

var _default = CodeBlockCommand;
exports.default = _default;