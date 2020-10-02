"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCommand;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createCommand(execute) {
  class CustomCommand extends _UICommand.default {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "isEnabled", state => {
        return this.execute(state);
      });

      _defineProperty(this, "execute", (state, dispatch, view) => {
        const tr = state.tr;
        let endTr = tr;
        execute(state, nextTr => {
          endTr = nextTr;
          dispatch && dispatch(endTr);
        }, view);
        return endTr.docChanged || tr !== endTr;
      });
    }

  }

  return new CustomCommand();
}