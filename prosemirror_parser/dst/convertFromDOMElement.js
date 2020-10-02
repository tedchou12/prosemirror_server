"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertFromDOMElement;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _DocNodeSpec = require("./DocNodeSpec");

var _EditorPlugins = _interopRequireDefault(require("./EditorPlugins"));

var _EditorSchema = _interopRequireDefault(require("./EditorSchema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertFromDOMElement(el, schema, plugins) {
  const effectiveSchema = schema || _EditorSchema.default;
  const effectivePlugins = plugins || _EditorPlugins.default;
  const bodyEl = el.querySelector('body'); // https://prosemirror.net/docs/ref/#model.ParseOptions.preserveWhitespace

  const doc = _prosemirrorModel.DOMParser.fromSchema(effectiveSchema).parse(el, {
    preserveWhitespace: true
  });

  if (bodyEl) {
    // Unfortunately the root node `doc` does not supoort `parseDOM`, thus
    // we'd have to assign its `attrs` manually.
    doc.attrs = (0, _DocNodeSpec.getAttrs)(bodyEl);
  }

  return _prosemirrorState.EditorState.create({
    doc,
    plugins: effectivePlugins
  });
}