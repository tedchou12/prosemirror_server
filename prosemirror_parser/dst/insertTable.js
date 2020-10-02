"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = insertTable;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _NodeNames = require("./NodeNames");

// const ZERO_WIDTH_SPACE_CHAR = '\u200b';
function insertTable(tr, schema, rows, cols) {
  if (!tr.selection || !tr.doc) {
    return tr;
  }

  const {
    from,
    to
  } = tr.selection;

  if (from !== to) {
    return tr;
  }

  const {
    nodes
  } = schema;
  const cell = nodes[_NodeNames.TABLE_CELL];
  const paragraph = nodes[_NodeNames.PARAGRAPH];
  const row = nodes[_NodeNames.TABLE_ROW];
  const table = nodes[_NodeNames.TABLE];

  if (!(cell && paragraph && row && table)) {
    return tr;
  }

  const rowNodes = [];

  for (let rr = 0; rr < rows; rr++) {
    const cellNodes = [];

    for (let cc = 0; cc < cols; cc++) {
      // [FS] IRAD-950 2020-05-25
      // Fix:Extra arrow key required for cell navigation using arrow right/Left
      const cellNode = cell.create(undefined, _prosemirrorModel.Fragment.fromArray([paragraph.create()]));
      cellNodes.push(cellNode);
    }

    const rowNode = row.create({}, _prosemirrorModel.Fragment.from(cellNodes));
    rowNodes.push(rowNode);
  }

  const tableNode = table.create({}, _prosemirrorModel.Fragment.from(rowNodes));
  tr = tr.insert(from, _prosemirrorModel.Fragment.from(tableNode));

  const selection = _prosemirrorState.TextSelection.create(tr.doc, from + 5, from + 5);

  tr = tr.setSelection(selection);
  return tr;
}