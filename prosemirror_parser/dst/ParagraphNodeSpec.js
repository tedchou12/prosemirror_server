"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertMarginLeftToIndentValue = convertMarginLeftToIndentValue;
exports.default = exports.getParagraphNodeAttrs = exports.toParagraphDOM = exports.EMPTY_CSS_VALUE = exports.ATTRIBUTE_INDENT = exports.MAX_INDENT_LEVEL = exports.MIN_INDENT_LEVEL = exports.INDENT_MARGIN_PT_SIZE = void 0;

var _clamp = _interopRequireDefault(require("./ui/clamp"));

var _convertToCSSPTValue = _interopRequireDefault(require("./convertToCSSPTValue"));

var _toCSSLineSpacing = _interopRequireDefault(require("./ui/toCSSLineSpacing"));

var _prosemirrorModel = require("prosemirror-model");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This assumes that every 36pt maps to one indent level.
const INDENT_MARGIN_PT_SIZE = 36;
exports.INDENT_MARGIN_PT_SIZE = INDENT_MARGIN_PT_SIZE;
const MIN_INDENT_LEVEL = 0;
exports.MIN_INDENT_LEVEL = MIN_INDENT_LEVEL;
const MAX_INDENT_LEVEL = 7;
exports.MAX_INDENT_LEVEL = MAX_INDENT_LEVEL;
const ATTRIBUTE_INDENT = 'data-indent';
exports.ATTRIBUTE_INDENT = ATTRIBUTE_INDENT;
const cssVal = new Set(['', '0%', '0pt', '0px']);
const EMPTY_CSS_VALUE = cssVal;
exports.EMPTY_CSS_VALUE = EMPTY_CSS_VALUE;
const ALIGN_PATTERN = /(left|right|center|justify)/; // https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.

const ParagraphNodeSpec = {
  attrs: {
    align: {
      default: null
    },
    color: {
      default: null
    },
    id: {
      default: null
    },
    indent: {
      default: null
    },
    lineSpacing: {
      default: null
    },
    // TODO: Add UI to let user edit / clear padding.
    paddingBottom: {
      default: null
    },
    // TODO: Add UI to let user edit / clear padding.
    paddingTop: {
      default: null
    },
    objectId: {
      default: null
    }
  },
  content: 'inline*',
  group: 'block',
  parseDOM: [{
    tag: 'p',
    getAttrs
  }],
  toDOM
};

function getAttrs(dom) {
  const {
    lineHeight,
    textAlign,
    marginLeft,
    paddingTop,
    paddingBottom
  } = dom.style;
  let align = dom.getAttribute('align') || textAlign || '';
  align = ALIGN_PATTERN.test(align) ? align : null;
  let indent = parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10);

  if (!indent && marginLeft) {
    indent = convertMarginLeftToIndentValue(marginLeft);
  }

  indent = indent || MIN_INDENT_LEVEL;
  const lineSpacing = lineHeight ? (0, _toCSSLineSpacing.default)(lineHeight) : null;
  const id = dom.getAttribute('id') || '';
  const objectId = dom.getAttribute('objectId') || null;
  return {
    align,
    indent,
    lineSpacing,
    paddingTop,
    paddingBottom,
    id,
    objectId
  };
}

function toDOM(node) {
  const {
    align,
    indent,
    lineSpacing,
    paddingTop,
    paddingBottom,
    id,
    objectId
  } = node.attrs;
  const attrs = {};
  let style = '';

  if (align && align !== 'left') {
    style += `text-align: ${align};`;
  }

  if (lineSpacing) {
    const cssLineSpacing = (0, _toCSSLineSpacing.default)(lineSpacing);
    style += `line-height: ${cssLineSpacing};` + // This creates the local css variable `--czi-content-line-height`
    // that its children may apply.
    `--czi-content-line-height: ${cssLineSpacing}`;
  }

  if (paddingTop && !EMPTY_CSS_VALUE.has(paddingTop)) {
    style += `padding-top: ${paddingTop};`;
  }

  if (paddingBottom && !EMPTY_CSS_VALUE.has(paddingBottom)) {
    style += `padding-bottom: ${paddingBottom};`;
  }

  style && (attrs.style = style);

  if (indent) {
    attrs[ATTRIBUTE_INDENT] = String(indent);
  }

  if (id) {
    attrs.id = id;
  }

  attrs.objectId = objectId;
  return ['p', attrs, 0];
}

const toParagraphDOM = toDOM;
exports.toParagraphDOM = toParagraphDOM;
const getParagraphNodeAttrs = getAttrs;
exports.getParagraphNodeAttrs = getParagraphNodeAttrs;

function convertMarginLeftToIndentValue(marginLeft) {
  const ptValue = (0, _convertToCSSPTValue.default)(marginLeft);
  return (0, _clamp.default)(MIN_INDENT_LEVEL, Math.floor(ptValue / INDENT_MARGIN_PT_SIZE), MAX_INDENT_LEVEL);
}

var _default = ParagraphNodeSpec;
exports.default = _default;