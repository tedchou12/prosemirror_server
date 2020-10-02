"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _BlockquoteNodeSpec = _interopRequireDefault(require("./BlockquoteNodeSpec"));

var _BookmarkNodeSpec = _interopRequireDefault(require("./BookmarkNodeSpec"));

var _BulletListNodeSpec = _interopRequireDefault(require("./BulletListNodeSpec"));

var _DocNodeSpec = _interopRequireDefault(require("./DocNodeSpec"));

var _HardBreakNodeSpec = _interopRequireDefault(require("./HardBreakNodeSpec"));

var _HeadingNodeSpec = _interopRequireDefault(require("./HeadingNodeSpec"));

var _HorizontalRuleNodeSpec = _interopRequireDefault(require("./HorizontalRuleNodeSpec"));

var _ImageNodeSpec = _interopRequireDefault(require("./ImageNodeSpec"));

var _ListItemNodeSpec = _interopRequireDefault(require("./ListItemNodeSpec"));

var _MathNodeSpec = _interopRequireDefault(require("./MathNodeSpec"));

var NodeNames = _interopRequireWildcard(require("./NodeNames"));

var _OrderedListNodeSpec = _interopRequireDefault(require("./OrderedListNodeSpec"));

var _ParagraphNodeSpec = _interopRequireDefault(require("./ParagraphNodeSpec"));

var _TableNodesSpecs = _interopRequireDefault(require("./TableNodesSpecs"));

var _TextNodeSpec = _interopRequireDefault(require("./TextNodeSpec"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  BLOCKQUOTE,
  BOOKMARK,
  BULLET_LIST,
  //CODE_BLOCK,
  DOC,
  HARD_BREAK,
  HEADING,
  HORIZONTAL_RULE,
  IMAGE,
  LIST_ITEM,
  MATH,
  ORDERED_LIST,
  PARAGRAPH,
  TEXT
} = NodeNames; // https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// !! Be careful with the order of these nodes, which may effect the parsing
// outcome.!!

const nodes = {
  [DOC]: _DocNodeSpec.default,
  [PARAGRAPH]: _ParagraphNodeSpec.default,
  [BLOCKQUOTE]: _BlockquoteNodeSpec.default,
  [HORIZONTAL_RULE]: _HorizontalRuleNodeSpec.default,
  [HEADING]: _HeadingNodeSpec.default,
  [TEXT]: _TextNodeSpec.default,
  [IMAGE]: _ImageNodeSpec.default,
  [MATH]: _MathNodeSpec.default,
  [HARD_BREAK]: _HardBreakNodeSpec.default,
  [BULLET_LIST]: _BulletListNodeSpec.default,
  [ORDERED_LIST]: _OrderedListNodeSpec.default,
  [LIST_ITEM]: _ListItemNodeSpec.default,
  [BOOKMARK]: _BookmarkNodeSpec.default
};
const marks = {};
const schema = new _prosemirrorModel.Schema({
  nodes,
  marks
});
const EditorNodes = schema.spec.nodes.append(_TableNodesSpecs.default);
var _default = EditorNodes;
exports.default = _default;