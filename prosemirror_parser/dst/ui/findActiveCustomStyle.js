"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findActiveCustomStyle;
exports.CUSTOMSTYLE_NAME_DEFAULT = void 0;

var _prosemirrorState = require("prosemirror-state");

var _MarkNames = require("../MarkNames");

var _findActiveMark = _interopRequireDefault(require("../findActiveMark"));

var _i18n = _interopRequireDefault(require("./i18n"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CUSTOMSTYLE_NAME_DEFAULT = [(0, _i18n.default)('Normal')]; // [FS] IRAD-1042 2020-09-17
// To find the selected custom style

exports.CUSTOMSTYLE_NAME_DEFAULT = CUSTOMSTYLE_NAME_DEFAULT;

function findActiveCustomStyle(state) {
  const {
    schema,
    doc,
    selection,
    tr
  } = state;
  const markType = schema.marks[_MarkNames.MARK_CUSTOMSTYLES];

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
    return sm && sm.attrs.stylename || CUSTOMSTYLE_NAME_DEFAULT;
  }

  const mark = markType ? (0, _findActiveMark.default)(doc, from, to, markType) : null;
  const name = mark && mark.attrs.stylename;

  if (!name) {
    return CUSTOMSTYLE_NAME_DEFAULT;
  }

  return name;
}