"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearMarks = clearMarks;
exports.clearHeading = clearHeading;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorTransform = require("prosemirror-transform");

var _NodeNames = require("./NodeNames");

var MarkNames = _interopRequireWildcard(require("./MarkNames"));

var _TextAlignCommand = require("./TextAlignCommand");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const {
  MARK_EM,
  MARK_FONT_SIZE,
  MARK_FONT_TYPE,
  MARK_STRIKE,
  MARK_STRONG,
  MARK_TEXT_COLOR,
  MARK_TEXT_HIGHLIGHT,
  MARK_UNDERLINE,
  MARK_CUSTOMSTYLES
} = MarkNames;
const FORMAT_MARK_NAMES = [MARK_EM, MARK_FONT_SIZE, MARK_FONT_TYPE, MARK_STRIKE, MARK_STRONG, MARK_TEXT_COLOR, MARK_TEXT_HIGHLIGHT, MARK_UNDERLINE, // [FS] IRAD-1042 2020-09-18
// Fix: To clear custom style format.
MARK_CUSTOMSTYLES];

function clearMarks(tr, schema) {
  const {
    doc,
    selection
  } = tr;

  if (!selection || !doc) {
    return tr;
  }

  const {
    from,
    to,
    empty
  } = selection;

  if (empty) {
    return tr;
  }

  const markTypesToRemove = new Set(FORMAT_MARK_NAMES.map(n => schema.marks[n]).filter(Boolean));

  if (!markTypesToRemove.size) {
    return tr;
  }

  const tasks = [];
  doc.nodesBetween(from, to, (node, pos) => {
    if (node.marks && node.marks.length) {
      node.marks.some(mark => {
        if (markTypesToRemove.has(mark.type)) {
          tasks.push({
            node,
            pos,
            mark
          });
        }
      });
      return true;
    }

    return true;
  });

  if (!tasks.length) {
    return tr;
  }

  tasks.forEach(job => {
    const {
      node,
      mark,
      pos
    } = job;
    tr = tr.removeMark(pos, pos + node.nodeSize, mark.type);
  }); // It should also clear text alignment.

  tr = (0, _TextAlignCommand.setTextAlign)(tr, schema, null);
  return tr;
} // [FS] IRAD-948 2020-05-22
// Clear Header formatting


function clearHeading(tr, schema) {
  const {
    doc,
    selection
  } = tr;

  if (!selection || !doc) {
    return tr;
  }

  const {
    from,
    to,
    empty
  } = selection;

  if (empty) {
    return tr;
  }

  const {
    nodes
  } = schema;
  const heading = nodes[_NodeNames.HEADING];
  const paragraph = nodes[_NodeNames.PARAGRAPH];
  const tasks = [];
  doc.nodesBetween(from, to, (node, pos) => {
    if (heading === node.type) {
      tasks.push({
        node,
        pos
      });
    }

    return true;
  });

  if (!tasks.length) {
    return tr;
  }

  tasks.forEach(job => {
    const {
      node,
      pos
    } = job;
    tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
  });
  return tr;
}