"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _EditorMarks = _interopRequireDefault(require("./EditorMarks"));

var _EditorNodes = _interopRequireDefault(require("./EditorNodes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EditorSchema = new _prosemirrorModel.Schema({
  nodes: _EditorNodes.default,
  marks: _EditorMarks.default
});
var _default = EditorSchema;
exports.default = _default;