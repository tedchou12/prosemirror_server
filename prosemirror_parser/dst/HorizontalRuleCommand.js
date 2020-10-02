"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _NodeNames = require("./NodeNames");

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function insertHorizontalRule(tr, schema) {
  const {
    selection
  } = tr;

  if (!selection) {
    return tr;
  }

  const {
    from,
    to
  } = selection;

  if (from !== to) {
    return tr;
  }

  const horizontalRule = schema.nodes[_NodeNames.HORIZONTAL_RULE];

  if (!horizontalRule) {
    return tr;
  }

  const node = horizontalRule.create({}, null, null);

  const frag = _prosemirrorModel.Fragment.from(node);

  tr = tr.insert(from, frag);
  return tr;
}

class HorizontalRuleCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        selection,
        schema
      } = state;
      const tr = insertHorizontalRule(state.tr.setSelection(selection), schema);

      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });
  }

}

var _default = HorizontalRuleCommand;
exports.default = _default;