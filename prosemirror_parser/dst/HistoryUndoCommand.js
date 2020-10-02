"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorHistory = require("prosemirror-history");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HistoryUndoCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "execute", (state, dispatch, view) => {
      return (0, _prosemirrorHistory.undo)(state, dispatch);
    });
  }

}

var _default = HistoryUndoCommand;
exports.default = _default;