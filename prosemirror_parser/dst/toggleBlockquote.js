"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleBlockquote;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorTransform = require("prosemirror-transform");

var _NodeNames = require("./NodeNames");

var _compareNumber = _interopRequireDefault(require("./compareNumber"));

var _isInsideListItem = _interopRequireDefault(require("./isInsideListItem"));

var _isListNode = _interopRequireDefault(require("./isListNode"));

var _toggleList = require("./toggleList");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toggleBlockquote(tr, schema) {
  const {
    nodes
  } = schema;
  const {
    selection,
    doc
  } = tr;
  const heading = nodes[_NodeNames.HEADING];
  const blockquote = nodes[_NodeNames.BLOCKQUOTE];
  const paragraph = nodes[_NodeNames.PARAGRAPH];
  const listItem = nodes[_NodeNames.LIST_ITEM];

  if (!selection || !doc || !heading || !paragraph || !listItem || !heading) {
    return tr;
  }

  const {
    from,
    to
  } = tr.selection;
  let startWithBlockQuote = null;
  const poses = [];
  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    const nodeType = node.type;
    const parentNodeType = parentNode.type;

    if (startWithBlockQuote === null) {
      startWithBlockQuote = nodeType === blockquote;
    }

    if (parentNodeType !== listItem) {
      poses.push(pos);
    }

    return !(0, _isListNode.default)(node);
  }); // Update from the bottom to avoid disruptive changes in pos.

  poses.sort(_compareNumber.default).reverse().forEach(pos => {
    tr = setBlockquoteNode(tr, schema, pos);
  });
  return tr;
}

function setBlockquoteNode(tr, schema, pos) {
  const {
    nodes
  } = schema;
  const heading = nodes[_NodeNames.HEADING];
  const paragraph = nodes[_NodeNames.PARAGRAPH];
  const blockquote = nodes[_NodeNames.BLOCKQUOTE];

  if (pos >= tr.doc.content.size) {
    // Workaround to handle the edge case that pos was shifted caused by `toggleList`.
    return tr;
  }

  const node = tr.doc.nodeAt(pos);

  if (!node || !heading || !paragraph) {
    return tr;
  }

  const nodeType = node.type;

  if ((0, _isInsideListItem.default)(tr.doc, pos)) {
    return tr;
  } else if ((0, _isListNode.default)(node)) {
    // Toggle list
    if (blockquote) {
      tr = (0, _toggleList.unwrapNodesFromList)(tr, schema, pos, paragraphNode => {
        const {
          content,
          marks,
          attrs
        } = paragraphNode;
        return blockquote.create(attrs, content, marks);
      });
    }
  } else if (nodeType === blockquote) {
    // Toggle heading
    tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
  } else if (nodeType === paragraph || nodeType === heading) {
    tr = tr.setNodeMarkup(pos, blockquote, node.attrs, node.marks);
  }

  return tr;
}