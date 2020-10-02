"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleCodeBlock;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _MarkNames = require("./MarkNames");

var _NodeNames = require("./NodeNames");

var _clearMarks = require("./clearMarks");

var _compareNumber = _interopRequireDefault(require("./compareNumber"));

var _isListNode = _interopRequireDefault(require("./isListNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toggleCodeBlock(tr, schema) {
  const {
    nodes
  } = schema;
  const {
    selection,
    doc
  } = tr;
  const codeBlock = nodes[_NodeNames.CODE_BLOCK];
  const paragraph = nodes[_NodeNames.PARAGRAPH];
  const heading = nodes[_NodeNames.HEADING];
  const blockquote = nodes[_NodeNames.BLOCKQUOTE];

  if (!selection || !doc || !codeBlock || !paragraph) {
    return tr;
  }

  const poses = [];
  const {
    from,
    to
  } = tr.selection;
  let allowed = true;
  let startWithCodeBlock = null;
  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type;

    if (startWithCodeBlock === null) {
      startWithCodeBlock = nodeType === codeBlock;
    }

    const {
      type,
      isBlock
    } = node;

    if (isBlock) {
      allowed = allowed && (type === paragraph || type === codeBlock || type === heading || type === blockquote);
      allowed && poses.push(pos);
    }

    return isBlock;
  }); // Update from the bottom to avoid disruptive changes in pos.

  allowed && poses.sort(_compareNumber.default).reverse().forEach(pos => {
    tr = setCodeBlockNodeEnabled(tr, schema, pos, startWithCodeBlock ? false : true);
  });
  return tr;
}

function setCodeBlockNodeEnabled(tr, schema, pos, enabled) {
  const {
    doc
  } = tr;

  if (!doc) {
    return tr;
  }

  const node = doc.nodeAt(pos);

  if (!node) {
    return tr;
  }

  if ((0, _isListNode.default)(node)) {
    return tr;
  }

  const {
    nodes
  } = schema;
  const codeBlock = nodes[_NodeNames.CODE_BLOCK];
  const paragraph = nodes[_NodeNames.PARAGRAPH];

  if (codeBlock && !enabled && node.type === codeBlock) {
    tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
  } else if (enabled && node.type !== codeBlock) {
    const {
      selection
    } = tr;
    tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, pos, pos + node.nodeSize));
    tr = (0, _clearMarks.clearMarks)(tr, schema);
    tr = tr.removeMark(pos, pos + node.nodeSize, schema.marks[_MarkNames.MARK_LINK]);
    tr = tr.setSelection(selection);
    tr = tr.setNodeMarkup(pos, codeBlock, node.attrs, node.marks);
  }

  return tr;
}