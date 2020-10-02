"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleHeading;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorTransform = require("prosemirror-transform");

var _NodeNames = require("./NodeNames");

var _compareNumber = _interopRequireDefault(require("./compareNumber"));

var _isInsideListItem = _interopRequireDefault(require("./isInsideListItem"));

var _isListNode = _interopRequireDefault(require("./isListNode"));

var _clearMarks = require("./clearMarks");

var _toggleList = require("./toggleList");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toggleHeading(tr, schema, level) {
  const {
    nodes
  } = schema;
  const {
    selection,
    doc
  } = tr;
  const blockquote = nodes[_NodeNames.BLOCKQUOTE];
  const heading = nodes[_NodeNames.HEADING];
  const listItem = nodes[_NodeNames.LIST_ITEM];
  const paragraph = nodes[_NodeNames.PARAGRAPH];

  if (!selection || !doc || !heading || !paragraph || !listItem || !blockquote) {
    return tr;
  }

  const {
    from,
    to
  } = tr.selection;
  let startWithHeadingBlock = null;
  const poses = [];
  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    const nodeType = node.type;
    const parentNodeType = parentNode.type;

    if (startWithHeadingBlock === null) {
      startWithHeadingBlock = nodeType === heading && node.attrs.level === level;
    }

    if (parentNodeType !== listItem) {
      poses.push(pos);
    }

    return !(0, _isListNode.default)(node);
  }); // Update from the bottom to avoid disruptive changes in pos.

  poses.sort(_compareNumber.default).reverse().forEach(pos => {
    tr = setHeadingNode(tr, schema, pos, startWithHeadingBlock ? null : level);
  });
  return tr;
}

function setHeadingNode(tr, schema, pos, level) {
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

  if (!node || !heading || !paragraph || !blockquote) {
    return tr;
  }

  const nodeType = node.type;

  if ((0, _isInsideListItem.default)(tr.doc, pos)) {
    return tr;
  } else if ((0, _isListNode.default)(node)) {
    // Toggle list
    if (heading && level !== null) {
      tr = (0, _toggleList.unwrapNodesFromList)(tr, schema, pos, paragraphNode => {
        const {
          content,
          marks,
          attrs
        } = paragraphNode;
        const headingAttrs = { ...attrs,
          level
        };
        return heading.create(headingAttrs, content, marks);
      });
    }
  } else if (nodeType === heading) {
    // Toggle heading
    if (level === null) {
      tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
    } else {
      tr = tr.setNodeMarkup(pos, heading, { ...node.attrs,
        level
      }, node.marks);
    }
  } else if (level && nodeType === paragraph || nodeType === blockquote) {
    // [FS] IRAD-948 2020-05-22
    // Clear Header formatting
    tr = (0, _clearMarks.clearMarks)(tr, schema);
    tr = tr.setNodeMarkup(pos, heading, { ...node.attrs,
      level
    }, node.marks);
  }

  return tr;
}