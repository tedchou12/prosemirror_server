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

var _toggleList = _interopRequireDefault(require("./toggleList"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ListToggleCommand extends _UICommand.default {
  constructor(ordered) {
    super();

    _defineProperty(this, "_ordered", void 0);

    _defineProperty(this, "isActive", state => {
      if (this._ordered) {
        return !!this._findList(state, _NodeNames.ORDERED_LIST);
      } else {
        return !!this._findList(state, _NodeNames.BULLET_LIST);
      }
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        selection,
        schema
      } = state;
      const nodeType = schema.nodes[this._ordered ? _NodeNames.ORDERED_LIST : _NodeNames.BULLET_LIST];
      let {
        tr
      } = state;
      tr = tr.setSelection(selection);

      if (!nodeType) {
        return tr;
      }

      tr = (0, _toggleList.default)(tr, schema, nodeType);

      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });

    this._ordered = ordered;
  }

  _findList(state, type) {
    const {
      nodes
    } = state.schema;
    const list = nodes[type];
    const findList = list ? (0, _prosemirrorUtils.findParentNodeOfType)(list) : _noop.default;
    return findList(state.selection);
  }

}

var _default = ListToggleCommand;
exports.default = _default;