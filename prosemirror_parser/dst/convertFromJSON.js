"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertFromJSON;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _EditorPlugins = _interopRequireDefault(require("./EditorPlugins"));

var _EditorSchema = _interopRequireDefault(require("./EditorSchema"));

var _createEmptyEditorState = _interopRequireDefault(require("./createEmptyEditorState"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertFromJSON(json, schema, plugins) {
  let editorSchema = schema || _EditorSchema.default; // [FS][IRAD-???? 2020-08-17]
  // Loads plugins and its curresponding schema in editor

  let effectivePlugins = _EditorPlugins.default;

  if (plugins) {
    for (let p of plugins) {
      if (!effectivePlugins.includes(p)) {
        effectivePlugins.push(p);

        if (p.getEffectiveSchema) {
          editorSchema = p.getEffectiveSchema(editorSchema);
        }
      }
    }
  }

  if (typeof json === 'string') {
    try {
      json = JSON.parse(json);
    } catch (ex) {
      console.error('convertFromJSON:', ex);
      return (0, _createEmptyEditorState.default)(schema, plugins);
    }
  }

  if (!json || typeof json !== 'object') {
    console.error('convertFromJSON: invalid object', json);
    return (0, _createEmptyEditorState.default)(schema, plugins);
  } // [FS] IRAD-1067 2020-09-19
  // Handle gracefully when error thrown on invalid json


  let doc = null;

  try {
    doc = editorSchema.nodeFromJSON(json);
  } catch (error) {
    return null;
  }

  return _prosemirrorState.EditorState.create({
    doc: doc,
    schema: editorSchema,
    plugins: effectivePlugins
  });
}