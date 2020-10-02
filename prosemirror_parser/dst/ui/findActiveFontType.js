"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findActiveFontType;
exports.FONT_TYPE_NAME_DEFAULT = void 0;

var _prosemirrorState = require("prosemirror-state");

var _MarkNames = require("../MarkNames");

var _findActiveMark = _interopRequireDefault(require("../findActiveMark"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This should map to `--czi-content-font-size` at `czi-editor.css`.
const FONT_TYPE_NAME_DEFAULT = 'Arial';
exports.FONT_TYPE_NAME_DEFAULT = FONT_TYPE_NAME_DEFAULT;

function findActiveFontType(state) {
  const {
    schema,
    doc,
    selection,
    tr
  } = state;
  const markType = schema.marks[_MarkNames.MARK_FONT_TYPE];

  if (!markType) {
    return FONT_TYPE_NAME_DEFAULT;
  }

  const {
    from,
    to,
    empty
  } = selection;

  if (empty) {
    const storedMarks = tr.storedMarks || state.storedMarks || selection.$cursor && selection.$cursor.marks && selection.$cursor.marks() || [];
    const sm = storedMarks.find(m => m.type === markType);
    return sm && sm.attrs.name || FONT_TYPE_NAME_DEFAULT;
  }

  const mark = markType ? (0, _findActiveMark.default)(doc, from, to, markType) : null;
  const fontName = mark && mark.attrs.name;

  if (!fontName) {
    return FONT_TYPE_NAME_DEFAULT;
  }

  return fontName;
}