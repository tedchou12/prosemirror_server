"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _CodeMarkSpec = _interopRequireDefault(require("./CodeMarkSpec"));

var _DocNodeSpec = _interopRequireDefault(require("./DocNodeSpec"));

var _EMMarkSpec = _interopRequireDefault(require("./EMMarkSpec"));

var _FontSizeMarkSpec = _interopRequireDefault(require("./FontSizeMarkSpec"));

var _FontTypeMarkSpec = _interopRequireDefault(require("./FontTypeMarkSpec"));

var _LinkMarkSpec = _interopRequireDefault(require("./LinkMarkSpec"));

var MarkNames = _interopRequireWildcard(require("./MarkNames"));

var _NodeNames = require("./NodeNames");

var _ParagraphNodeSpec = _interopRequireDefault(require("./ParagraphNodeSpec"));

var _SpacerMarkSpec = _interopRequireDefault(require("./SpacerMarkSpec"));

var _StrikeMarkSpec = _interopRequireDefault(require("./StrikeMarkSpec"));

var _StrongMarkSpec = _interopRequireDefault(require("./StrongMarkSpec"));

var _TextColorMarkSpec = _interopRequireDefault(require("./TextColorMarkSpec"));

var _TextHighlightMarkSpec = _interopRequireDefault(require("./TextHighlightMarkSpec"));

var _TextNoWrapMarkSpec = _interopRequireDefault(require("./TextNoWrapMarkSpec"));

var _TextNodeSpec = _interopRequireDefault(require("./TextNodeSpec"));

var _TextSelectionMarkSpec = _interopRequireDefault(require("./TextSelectionMarkSpec"));

var _TextSuperMarkSpec = _interopRequireDefault(require("./TextSuperMarkSpec"));

var _TextSubMarkSpec = _interopRequireDefault(require("./TextSubMarkSpec"));

var _TextUnderlineMarkSpec = _interopRequireDefault(require("./TextUnderlineMarkSpec"));

var _CustomStyleMarkSpec = _interopRequireDefault(require("./CustomStyleMarkSpec"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  MARK_CODE,
  MARK_EM,
  MARK_FONT_SIZE,
  MARK_FONT_TYPE,
  MARK_LINK,
  MARK_NO_BREAK,
  MARK_STRIKE,
  MARK_STRONG,
  MARK_SUPER,
  MARK_SUB,
  MARK_TEXT_COLOR,
  MARK_TEXT_HIGHLIGHT,
  MARK_TEXT_SELECTION,
  MARK_UNDERLINE,
  MARK_SPACER,
  MARK_CUSTOMSTYLES
} = MarkNames; // These nodes are required to build basic marks.

const nodes = {
  [_NodeNames.DOC]: _DocNodeSpec.default,
  [_NodeNames.PARAGRAPH]: _ParagraphNodeSpec.default,
  [_NodeNames.TEXT]: _TextNodeSpec.default
};
const marks = {
  // Link mark should be rendered first.
  // https://discuss.prosemirror.net/t/prevent-marks-from-breaking-up-links/401/5
  [MARK_LINK]: _LinkMarkSpec.default,
  [MARK_NO_BREAK]: _TextNoWrapMarkSpec.default,
  [MARK_CODE]: _CodeMarkSpec.default,
  [MARK_EM]: _EMMarkSpec.default,
  [MARK_FONT_SIZE]: _FontSizeMarkSpec.default,
  [MARK_FONT_TYPE]: _FontTypeMarkSpec.default,
  [MARK_SPACER]: _SpacerMarkSpec.default,
  [MARK_STRIKE]: _StrikeMarkSpec.default,
  [MARK_STRONG]: _StrongMarkSpec.default,
  [MARK_SUPER]: _TextSuperMarkSpec.default,
  [MARK_SUB]: _TextSubMarkSpec.default,
  [MARK_TEXT_COLOR]: _TextColorMarkSpec.default,
  [MARK_TEXT_HIGHLIGHT]: _TextHighlightMarkSpec.default,
  [MARK_TEXT_SELECTION]: _TextSelectionMarkSpec.default,
  [MARK_UNDERLINE]: _TextUnderlineMarkSpec.default,
  [MARK_CUSTOMSTYLES]: _CustomStyleMarkSpec.default
};
const schema = new _prosemirrorModel.Schema({
  nodes,
  marks
});
const EditorMarks = schema.spec.marks;
var _default = EditorMarks;
exports.default = _default;