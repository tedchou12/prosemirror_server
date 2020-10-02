"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorTables = require("prosemirror-tables");

var _TableCellMenuPlugin = _interopRequireDefault(require("./TableCellMenuPlugin"));

var _TableResizePlugin = _interopRequireDefault(require("./TableResizePlugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Tables
// https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
var _default = [new _TableCellMenuPlugin.default(), new _TableResizePlugin.default(), (0, _prosemirrorTables.tableEditing)()];
exports.default = _default;