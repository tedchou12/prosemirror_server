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

var _toggleHeading = _interopRequireDefault(require("./toggleHeading"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HeadingCommand extends _UICommand.default {
  constructor(level) {
    super();

    _defineProperty(this, "_level", void 0);

    _defineProperty(this, "isActive", state => {
      const result = this._findHeading(state);

      return !!(result && result.node && result.node.attrs && result.node.attrs.level === this._level);
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = (0, _toggleHeading.default)(state.tr.setSelection(selection), schema, this._level);

      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });

    this._level = level;
  }

  _findHeading(state) {
    const heading = state.schema.nodes[_NodeNames.HEADING];
    const fn = heading ? (0, _prosemirrorUtils.findParentNodeOfType)(heading) : _noop.default;
    return fn(state.selection);
  }

}

var _default = HeadingCommand;
exports.default = _default;