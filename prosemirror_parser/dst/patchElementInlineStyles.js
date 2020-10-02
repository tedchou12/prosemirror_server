"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchElementInlineStyles;

var _hyphenize = _interopRequireDefault(require("./hyphenize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BLOCK_TAG_SELECTOR = 'p,h1,h2,h3,h4,h5,h6,li'.replace(/\w+/g, m => `${m}[style]`);

function patchElementInlineStyles(doc) {
  // Ensure that inline-styles can be correctly translated as inline marks.
  // Workaround to patch inline styles added to block tags.
  const bEls = Array.from(doc.querySelectorAll(BLOCK_TAG_SELECTOR));
  bEls.forEach(patchBlockElement);
}

const NODE_TYPE_TEXT = 3;
const NODE_TYPE_ELEMENT = 1;
const INLINE_STYLE_NAMES = ['backgroundColor', 'color', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'textDecoration', 'textIndent'];
const INLINE_ELEMENT_NODE_NAMES = new Set(['A', 'B', 'EM', 'I', 'SPAN', 'STRONG', 'U']);

function patchBlockElement(el) {
  INLINE_STYLE_NAMES.forEach(name => patchBlockElementStyle(el, name));
} // Move the specified inline style of the element to its child nodes. This
// assumes that its child nodes are inline elements.


function patchBlockElementStyle(el, inlineStyleName) {
  const element = el;
  const elementStyle = element.style;
  const value = elementStyle && elementStyle[inlineStyleName];

  if (inlineStyleName === 'textIndent' && value) {
    // This is the workaround to fix the issue that people with mix both
    // text-indent and margin-left together.
    // For instance, `margin-left: -100px` and `text-indent: 100px` shall
    // offset each other.
    const marginLeft = elementStyle.marginLeft || '';

    if (value === '-' + marginLeft || marginLeft === '-' + value) {
      elementStyle.marginLeft = '';
      elementStyle.textIndent = '';
    }
  }

  if (!value) {
    return;
  } // Remove the style.


  elementStyle[inlineStyleName] = '';
  const childNodes = Array.from(element.childNodes);
  childNodes.forEach(node => {
    const {
      nodeType,
      style,
      nodeName,
      ownerDocument,
      parentElement
    } = node;

    if (nodeType === NODE_TYPE_ELEMENT) {
      if (INLINE_ELEMENT_NODE_NAMES.has(nodeName)) {
        const cssText = `${(0, _hyphenize.default)(inlineStyleName)}: ${value};` + style.cssText;
        style.cssText = cssText;
      }
    } else if (nodeType === NODE_TYPE_TEXT) {
      if (ownerDocument && parentElement) {
        const span = ownerDocument.createElement('span');
        span.style[inlineStyleName] = value;
        parentElement.insertBefore(span, node);
        span.appendChild(node);
      }
    }
  });
}