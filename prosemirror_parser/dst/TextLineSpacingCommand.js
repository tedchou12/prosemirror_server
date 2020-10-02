"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTextLineSpacing = setTextLineSpacing;
exports.default = void 0;

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

var _prosemirrorState = require("prosemirror-state");

var _NodeNames = require("./NodeNames");

var _prosemirrorView = require("prosemirror-view");

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorTransform = require("prosemirror-transform");

var _i18n = _interopRequireDefault(require("./ui/i18n"));

var _toCSSLineSpacing = require("./ui/toCSSLineSpacing");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function setTextLineSpacing(tr, schema, lineSpacing) {
  const {
    selection,
    doc
  } = tr;

  if (!selection || !doc) {
    return tr;
  }

  if (!(selection instanceof _prosemirrorState.TextSelection) && !(selection instanceof _prosemirrorState.AllSelection)) {
    return tr;
  }

  const {
    from,
    to
  } = selection;
  const paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  const heading = schema.nodes[_NodeNames.HEADING];
  const listItem = schema.nodes[_NodeNames.LIST_ITEM];
  const blockquote = schema.nodes[_NodeNames.BLOCKQUOTE];

  if (!paragraph && !heading && !listItem && !blockquote) {
    return tr;
  }

  const tasks = [];
  const lineSpacingValue = lineSpacing || null;
  doc.nodesBetween(from, to, (node, pos, parentNode) => {
    const nodeType = node.type;

    if (nodeType === paragraph || nodeType === heading || nodeType === listItem || nodeType === blockquote) {
      const lineSpacing = node.attrs.lineSpacing || null;

      if (lineSpacing !== lineSpacingValue) {
        tasks.push({
          node,
          pos,
          nodeType
        });
      }

      return nodeType === listItem ? true : false;
    }

    return true;
  });

  if (!tasks.length) {
    return tr;
  }

  tasks.forEach(job => {
    const {
      node,
      pos,
      nodeType
    } = job;
    let {
      attrs
    } = node;

    if (lineSpacingValue) {
      attrs = { ...attrs,
        lineSpacing: lineSpacingValue
      };
    } else {
      attrs = { ...attrs,
        lineSpacing: null
      };
    }

    tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
  });
  return tr;
}

function createGroup() {
  const group = {
    [(0, _i18n.default)('Single')]: new TextLineSpacingCommand(_toCSSLineSpacing.SINGLE_LINE_SPACING),
    '1.15': new TextLineSpacingCommand(_toCSSLineSpacing.LINE_SPACING_115),
    '1.5': new TextLineSpacingCommand(_toCSSLineSpacing.LINE_SPACING_150),
    [(0, _i18n.default)('Double')]: new TextLineSpacingCommand(_toCSSLineSpacing.DOUBLE_LINE_SPACING)
  };
  return [group];
}

class TextLineSpacingCommand extends _UICommand.default {
  constructor(lineSpacing) {
    super();

    _defineProperty(this, "_lineSpacing", void 0);

    _defineProperty(this, "isActive", state => {
      const {
        selection,
        doc,
        schema
      } = state;
      const {
        from,
        to
      } = selection;
      const paragraph = schema.nodes[_NodeNames.PARAGRAPH];
      const heading = schema.nodes[_NodeNames.HEADING];
      let keepLooking = true;
      let active = false;
      doc.nodesBetween(from, to, (node, pos) => {
        const nodeType = node.type;

        if (keepLooking && (nodeType === paragraph || nodeType === heading) && node.attrs.lineSpacing === this._lineSpacing) {
          keepLooking = false;
          active = true;
        }

        return keepLooking;
      });
      return active;
    });

    _defineProperty(this, "isEnabled", state => {
      return this.isActive(state) || this.execute(state);
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = setTextLineSpacing(state.tr.setSelection(selection), schema, this._lineSpacing);

      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    });

    this._lineSpacing = lineSpacing;
  }

}

_defineProperty(TextLineSpacingCommand, "createGroup", createGroup);

var _default = TextLineSpacingCommand;
exports.default = _default;