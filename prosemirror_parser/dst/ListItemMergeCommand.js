"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nullthrows = _interopRequireDefault(require("nullthrows"));

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorView = require("prosemirror-view");

var _NodeNames = require("./NodeNames");

var _nodeAt = _interopRequireDefault(require("./nodeAt"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function mergeListItemUp(tr, schema) {
  // This merge a list item to is previous list item of the selection is at the
  // beginning of the list item.
  const {
    selection
  } = tr;

  if (!selection) {
    return tr;
  }

  const nodeType = schema.nodes[_NodeNames.LIST_ITEM];

  if (!nodeType) {
    return tr;
  }

  const {
    from,
    empty
  } = selection;

  if (!empty) {
    // Selection is collapsed.
    return tr;
  }

  const result = (0, _prosemirrorUtils.findParentNodeOfType)(nodeType)(selection);

  if (!result) {
    return tr;
  }

  const {
    pos,
    node
  } = result;

  if (from !== pos + 2) {
    // Selection is not at the begining of the list item.
    return tr;
  }

  const $pos = tr.doc.resolve(pos);
  const prevNode = $pos.nodeBefore;

  if (!prevNode || prevNode.type !== nodeType) {
    return tr;
  }

  if (node.childCount !== 1) {
    // list item should only have one child (paragraph).
    return tr;
  }

  const paragraphNode = node.firstChild;
  const textNode = schema.text(' '); // Delete the list item

  tr = tr.delete(pos - 2, pos + node.nodeSize); // Append extra space character to its previous list item.

  tr = tr.insert(pos - 2, _prosemirrorModel.Fragment.from(textNode)); // Move the content to its previous list item.

  tr = tr.insert(pos - 1, _prosemirrorModel.Fragment.from(paragraphNode.content));
  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, pos - 1, pos - 1));
  return tr;
}

function mergeListItemDown(tr, schema) {
  // This merge a list item to is next list item of the selection is at the
  // beginning of the list item.
  const {
    selection
  } = tr;

  if (!selection) {
    return tr;
  }

  const listItem = schema.nodes[_NodeNames.LIST_ITEM];

  if (!listItem) {
    return tr;
  }

  const {
    from,
    empty
  } = selection;

  if (!empty) {
    // Selection is collapsed.
    return tr;
  }

  const result = (0, _prosemirrorUtils.findParentNodeOfType)(listItem)(selection);

  if (!result) {
    return tr;
  }

  const {
    pos,
    node
  } = result;

  if (from !== pos + node.content.size) {
    // Selection is not at the begining of the list item.
    return tr;
  }

  const $pos = tr.doc.resolve(pos);
  const list = $pos.parent.type;
  const listResult = (0, _prosemirrorUtils.findParentNodeOfType)(list)(selection);

  if (!listResult) {
    return tr;
  }

  const nextFrom = pos + node.nodeSize;
  let nextNode = (0, _nodeAt.default)(tr.doc, nextFrom);
  let deleteFrom = nextFrom;

  if (listResult.start + listResult.node.content.size === nextFrom) {
    // It's at the end of the last list item. It shall bring the content of the
    // block after the list.
    nextNode = (0, _nodeAt.default)(tr.doc, nextFrom + 1);
    deleteFrom += 1;
  }

  if (!nextNode) {
    return tr;
  }

  let nextContent;

  switch (nextNode.type) {
    case listItem:
      // List item should only have one child (paragraph).
      const paragraphNode = (0, _nullthrows.default)(nextNode.firstChild);
      nextContent = _prosemirrorModel.Fragment.from(paragraphNode.content);
      break;

    case schema.nodes[_NodeNames.HEADING]:
    case schema.nodes[_NodeNames.PARAGRAPH]:
      // Will bring in the content of the next block.
      nextContent = _prosemirrorModel.Fragment.from(nextNode.content);
      break;
  }

  if (!nextContent) {
    return tr;
  }

  const textNode = schema.text(' '); // Delete the next node.

  tr = tr.delete(deleteFrom, deleteFrom + nextNode.nodeSize); // Append extra space character to its previous list item.

  tr = tr.insert(nextFrom - 2, nextContent); // Move the content to the list item.

  tr = tr.insert(nextFrom - 2, _prosemirrorModel.Fragment.from(textNode));
  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, nextFrom - 2, nextFrom - 2));
  return tr;
}

class ListItemMergeCommand extends _UICommand.default {
  constructor(_direction) {
    super();

    _defineProperty(this, "_direction", '');

    _defineProperty(this, "isActive", state => {
      return false;
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        selection,
        schema
      } = state;
      let {
        tr
      } = state;
      const direction = this._direction;

      if (direction === 'down') {
        tr = mergeListItemDown(tr.setSelection(selection), schema);
      } else if (direction === 'up') {
        tr = mergeListItemUp(tr.setSelection(selection), schema);
      }

      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });

    this._direction = _direction;
  }

}

var _default = ListItemMergeCommand;
exports.default = _default;