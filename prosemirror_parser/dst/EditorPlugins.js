"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _EditorSchema = _interopRequireDefault(require("./EditorSchema"));

var _buildEditorPlugins = _interopRequireDefault(require("./buildEditorPlugins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Plugin
const EditorPlugins = (0, _buildEditorPlugins.default)(_EditorSchema.default);
var _default = EditorPlugins;
exports.default = _default;