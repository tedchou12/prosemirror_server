"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function getAttrs(dom) {
  let align = dom.getAttribute('data-align') || dom.getAttribute('align');

  if (align) {
    align = /(left|right|center)/.test(align) ? align : null;
  }

  return {
    align,
    latex: dom.getAttribute('data-latex') || null
  };
}

const MathNodeSpec = {
  inline: true,
  attrs: {
    align: {
      default: null
    },
    latex: {
      default: ''
    }
  },
  group: 'inline',
  draggable: true,
  parseDOM: [{
    tag: 'math[data-latex]',
    getAttrs
  }, {
    tag: 'span[data-latex]',
    getAttrs
  }],

  toDOM(node) {
    // Normally, the DOM structure of the math node is rendered by
    // `MathNodeView`. This method is only called when user selects a
    // math node and copies it, which triggers the "serialize to HTML" flow that
    // calles this method.
    const {
      align,
      latex
    } = node.attrs;
    const domAttrs = {};

    if (align) {
      domAttrs.align = align;
    }

    if (latex) {
      domAttrs['data-latex'] = latex;
    }

    return ['span', domAttrs];
  }

};
var _default = MathNodeSpec;
exports.default = _default;