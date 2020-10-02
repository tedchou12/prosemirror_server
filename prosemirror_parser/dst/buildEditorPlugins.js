"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildEditorPlugins;

var _prosemirrorCommands = require("prosemirror-commands");

var _prosemirrorDropcursor = require("prosemirror-dropcursor");

var _prosemirrorGapcursor = require("prosemirror-gapcursor");

var _prosemirrorHistory = require("prosemirror-history");

var _prosemirrorKeymap = require("prosemirror-keymap");

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _ContentPlaceholderPlugin = _interopRequireDefault(require("./ContentPlaceholderPlugin"));

var _CursorPlaceholderPlugin = _interopRequireDefault(require("./CursorPlaceholderPlugin"));

var _EditorPageLayoutPlugin = _interopRequireDefault(require("./EditorPageLayoutPlugin"));

var _ImageUploadPlaceholderPlugin = _interopRequireDefault(require("./ImageUploadPlaceholderPlugin"));

var _LinkTooltipPlugin = _interopRequireDefault(require("./LinkTooltipPlugin"));

var _SelectionPlaceholderPlugin = _interopRequireDefault(require("./SelectionPlaceholderPlugin"));

var _TablePlugins = _interopRequireDefault(require("./TablePlugins"));

var _buildInputRules = _interopRequireDefault(require("./buildInputRules"));

var _createEditorKeyMap = _interopRequireDefault(require("./createEditorKeyMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Creates the default plugin for the editor.
function buildEditorPlugins(schema) {
  const plugins = [new _ContentPlaceholderPlugin.default(), new _CursorPlaceholderPlugin.default(), new _EditorPageLayoutPlugin.default(), new _ImageUploadPlaceholderPlugin.default(), new _LinkTooltipPlugin.default(), new _SelectionPlaceholderPlugin.default(), setPluginKey((0, _buildInputRules.default)(schema), 'InputRules'), setPluginKey((0, _prosemirrorDropcursor.dropCursor)(), 'DropCursor'), setPluginKey((0, _prosemirrorGapcursor.gapCursor)(), 'GapCursor'), (0, _prosemirrorHistory.history)(), setPluginKey((0, _prosemirrorKeymap.keymap)((0, _createEditorKeyMap.default)()), 'EditorKeyMap'), setPluginKey((0, _prosemirrorKeymap.keymap)(_prosemirrorCommands.baseKeymap), 'BaseKeymap')].concat(_TablePlugins.default);
  return plugins;
} // [FS] IRAD-1005 2020-07-07
// Upgrade outdated packages.
// set plugin keys so that to avoid duplicate key error when keys are assigned automatically.


function setPluginKey(plugin, key) {
  plugin.spec.key = new _prosemirrorState.PluginKey(key + 'Plugin');
  plugin.key = plugin.spec.key.key;
  return plugin;
}