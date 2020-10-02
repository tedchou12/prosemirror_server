"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _clearMarks = require("./clearMarks");

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MarksClearCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "isActive", state => {
      return false;
    });

    _defineProperty(this, "isEnabled", state => {
      const {
        selection
      } = state;
      return !selection.empty && (selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection);
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      let tr = (0, _clearMarks.clearMarks)(state.tr.setSelection(state.selection), state.schema); // [FS] IRAD-948 2020-05-22
      // Clear Header formatting

      tr = (0, _clearMarks.clearHeading)(tr, state.schema);

      if (dispatch && tr.docChanged) {
        dispatch(tr);
        return true;
      }

      return false;
    });
  }

}

var _default = MarksClearCommand;
exports.default = _default;