"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTables = require("prosemirror-tables");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _NodeNames = require("./NodeNames");

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isBlankParagraphNode(node) {
  if (!node) {
    return false;
  }

  if (node.type.name !== _NodeNames.PARAGRAPH) {
    return false;
  }

  const {
    firstChild,
    lastChild
  } = node;

  if (!firstChild) {
    return true;
  }

  if (firstChild !== lastChild) {
    return false;
  }

  return firstChild.type.name === _NodeNames.TEXT && firstChild.text === ' ';
}

function purgeConsecutiveBlankParagraphNodes(tr, schema) {
  const paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  const cell = schema.nodes[_NodeNames.TABLE_CELL];

  if (!paragraph || !cell) {
    return tr;
  }

  const {
    doc,
    selection
  } = tr;

  if (!selection instanceof _prosemirrorTables.CellSelection) {
    return tr;
  }

  const {
    from,
    to
  } = selection;
  const paragraphPoses = [];
  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    if (node.type === paragraph && parentNode.type === cell) {
      if (isBlankParagraphNode(node)) {
        const $pos = tr.doc.resolve(pos);

        if (isBlankParagraphNode($pos.nodeBefore)) {
          paragraphPoses.push(pos);
        }
      }

      return false;
    } else {
      return true;
    }
  });
  paragraphPoses.reverse().forEach(pos => {
    const cell = tr.doc.nodeAt(pos);
    tr = tr.delete(pos, pos + cell.nodeSize);
  });
  return tr;
}

class TableMergeCellsCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        tr,
        schema,
        selection
      } = state;
      let endTr = tr;

      if (selection instanceof _prosemirrorTables.CellSelection) {
        (0, _prosemirrorTables.mergeCells)(state, nextTr => {
          endTr = nextTr;
        }, view); // Also merge onsecutive blank paragraphs into one.

        endTr = purgeConsecutiveBlankParagraphNodes(endTr, schema);
      }

      const changed = endTr.docChanged || endTr !== tr;
      changed && dispatch && dispatch(endTr);
      return changed;
    });
  }

}

var _default = TableMergeCellsCommand;
exports.default = _default;