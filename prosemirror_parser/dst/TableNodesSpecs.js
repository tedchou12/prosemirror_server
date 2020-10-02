"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toCSSColor = _interopRequireDefault(require("./ui/toCSSColor"));

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorTables = require("prosemirror-tables");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NO_VISIBLE_BORDER_WIDTH = new Set(['0pt', '0px']); // https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js

const TableNodesSpecs = (0, _prosemirrorTables.tableNodes)({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    borderColor: {
      default: null,

      getFromDOM(dom) {
        const {
          borderColor,
          borderWidth
        } = dom.style;

        if (NO_VISIBLE_BORDER_WIDTH.has(borderWidth)) {
          return 'transparent';
        }

        return borderColor && (0, _toCSSColor.default)(borderColor) || null;
      },

      setDOMAttr(value, attrs) {
        if (value) {
          attrs.style = (attrs.style || '') + `;border-color: ${value};`;
        }
      }

    },
    background: {
      default: null,

      // TODO: Move these to a table helper.
      getFromDOM(dom) {
        return dom.style.backgroundColor || null;
      },

      setDOMAttr(value, attrs) {
        if (value) {
          attrs.style = (attrs.style || '') + `;background-color: ${value};`;
        }
      }

    }
  }
}); // Override the default table node spec to support custom attributes.

const TableNodeSpec = Object.assign({}, TableNodesSpecs.table, {
  attrs: {
    marginLeft: {
      default: null
    },
    objectId: {
      default: null
    }
  },
  parseDOM: [{
    tag: 'table',

    getAttrs(dom) {
      const {
        marginLeft
      } = dom.style;
      const objectId = dom.getAttribute('objectId') || null;

      if (marginLeft && /\d+px/.test(marginLeft)) {
        return {
          marginLeft: parseFloat(marginLeft),
          objectId: objectId
        };
      }

      return {
        objectId: objectId
      };
    }

  }],

  toDOM(node) {
    // Normally, the DOM structure of the table node is rendered by
    // `TableNodeView`. This method is only called when user selects a
    // table node and copies it, which triggers the "serialize to HTML" flow
    //  that calles this method.
    const {
      marginLeft,
      objectId
    } = node.attrs;
    const domAttrs = {};
    domAttrs.objectId = objectId;

    if (marginLeft) {
      domAttrs.style = `margin-left: ${marginLeft}px`;
    }

    return ['table', domAttrs, 0];
  }

});
Object.assign(TableNodesSpecs, {
  table: TableNodeSpec
});
var _default = TableNodesSpecs;
exports.default = _default;