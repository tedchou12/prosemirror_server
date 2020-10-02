"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findActionableCell;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTables = require("prosemirror-tables");

var _prosemirrorUtils = require("prosemirror-utils");

var _NodeNames = require("./NodeNames");

function findActionableCellFromSelection(selection) {
  const {
    $anchorCell
  } = selection;
  const start = $anchorCell.start(-1);
  const table = $anchorCell.node(-1);

  const tableMap = _prosemirrorTables.TableMap.get(table);

  let topRightRect;
  let posFound = null;
  let nodeFound = null;
  selection.forEachCell((cell, cellPos) => {
    const cellRect = tableMap.findCell(cellPos - start);

    if (!topRightRect || cellRect.top >= topRightRect.top && cellRect.left > topRightRect.left) {
      topRightRect = cellRect;
      posFound = cellPos;
      nodeFound = cell;
    }
  });
  return posFound === null ? null : {
    node: nodeFound,
    pos: posFound
  };
}

function findActionableCell(state) {
  const {
    doc,
    selection,
    schema
  } = state;
  const tdType = schema.nodes[_NodeNames.TABLE_CELL];
  const thType = schema.nodes[_NodeNames.TABLE_HEADER];

  if (!tdType && !thType) {
    return null;
  }

  let userSelection = selection;

  if (userSelection instanceof _prosemirrorState.TextSelection) {
    const {
      from,
      to
    } = selection;

    if (from !== to) {
      return null;
    }

    const result = tdType && (0, _prosemirrorUtils.findParentNodeOfType)(tdType)(selection) || thType && (0, _prosemirrorUtils.findParentNodeOfType)(thType)(selection);

    if (!result) {
      return null;
    }

    userSelection = _prosemirrorTables.CellSelection.create(doc, result.pos);
  }

  if (userSelection instanceof _prosemirrorTables.CellSelection) {
    return findActionableCellFromSelection(userSelection);
  }

  return null;
}