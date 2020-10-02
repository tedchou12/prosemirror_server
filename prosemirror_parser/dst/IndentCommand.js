"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

var _updateIndentLevel = _interopRequireDefault(require("./updateIndentLevel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class IndentCommand extends _UICommand.default {
  constructor(delta) {
    super();

    _defineProperty(this, "_delta", void 0);

    _defineProperty(this, "isActive", state => {
      return false;
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
      tr = (0, _updateIndentLevel.default)(tr, schema, this._delta);

      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });

    this._delta = delta;
  }

}

var _default = IndentCommand;
exports.default = _default;