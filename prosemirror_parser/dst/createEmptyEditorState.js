"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEmptyEditorStateschema;
exports.EMPTY_DOC_JSON = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _convertFromJSON = _interopRequireDefault(require("./convertFromJSON"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EMPTY_DOC_JSON = {
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{
      type: 'text',
      text: ' '
    }]
  }]
};
exports.EMPTY_DOC_JSON = EMPTY_DOC_JSON;

function createEmptyEditorStateschema(schema, plugins) {
  // TODO: Check if schema support doc and paragraph nodes.
  return (0, _convertFromJSON.default)(EMPTY_DOC_JSON, schema, plugins);
}