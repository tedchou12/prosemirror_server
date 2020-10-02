"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorView = require("prosemirror-view");

var _prosemirrorTables = require("prosemirror-tables");

// A custom table view that renders the margin-left style.
class TableNodeView extends _prosemirrorTables.TableView {
  constructor(node, colMinWidth, view) {
    super(node, colMinWidth, view);

    this._updateMargin(node);
  }

  update(node) {
    const updated = super.update(node);

    if (updated) {
      this._updateMargin(node);
    }

    return updated;
  }

  _updateMargin(node) {
    const marginLeft = node.attrs && node.attrs.marginLeft || 0;
    this.table.style.marginLeft = marginLeft ? `${marginLeft}px` : '';
  }

}

exports.default = TableNodeView;