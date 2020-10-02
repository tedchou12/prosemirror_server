"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = blockQuoteInputRule;

var _prosemirrorInputrules = require("prosemirror-inputrules");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _NodeNames = require("./NodeNames");

var _toggleBlockquote = _interopRequireDefault(require("./toggleBlockquote"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Given a blockquote node type, returns an input rule that turns `"> "`
// at the start of a textblock into a blockquote.
const MACRO_PATTERN = /^\s*>\s$/;

function handleBlockQuoteInputRule(state, match, start, end) {
  const {
    schema
  } = state;
  let {
    tr
  } = state;
  const nodeType = schema.nodes[_NodeNames.BLOCKQUOTE];

  if (!nodeType) {
    return tr;
  }

  tr = (0, _toggleBlockquote.default)(tr, schema);

  if (tr.docChanged) {
    tr = tr.delete(start, end);
  }

  return tr;
}

function blockQuoteInputRule() {
  return new _prosemirrorInputrules.InputRule(MACRO_PATTERN, handleBlockQuoteInputRule);
}