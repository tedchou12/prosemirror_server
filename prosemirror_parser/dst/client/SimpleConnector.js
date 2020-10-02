"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorModel = require("prosemirror-model");

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SimpleConnector {
  constructor(_editorState, setState) {
    _defineProperty(this, "_setState", void 0);

    _defineProperty(this, "_editorState", void 0);

    _defineProperty(this, "onEdit", transaction => {
      _reactDom.default.unstable_batchedUpdates(() => {
        const editorState = this._editorState.apply(transaction);

        const state = {
          editorState,
          data: transaction.doc.toJSON()
        };

        this._setState(state, () => {
          this._editorState = editorState;
        });
      });
    });

    _defineProperty(this, "getState", () => {
      return this._editorState;
    });

    _defineProperty(this, "updateSchema", schema => {});

    this._editorState = _editorState;
    this._setState = setState;
  }

}

var _default = SimpleConnector;
exports.default = _default;