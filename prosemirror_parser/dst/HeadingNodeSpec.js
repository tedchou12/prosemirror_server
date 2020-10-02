"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HEADING_NAMES = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _ParagraphNodeSpec = _interopRequireWildcard(require("./ParagraphNodeSpec"));

var _i18n = _interopRequireDefault(require("./ui/i18n"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const TAG_NAME_TO_LEVEL = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6
}; // [FS] IRAD-1042 2020-09-09
// Fix: Changes the menu for include the custom styles.

const HEADING_NAMES = [{
  "name": [(0, _i18n.default)("Normal")],
  "level": 0
}, {
  "name": [(0, _i18n.default)("Heading 1")],
  "level": 1
}, {
  "name": [(0, _i18n.default)("Heading 2")],
  "level": 2
}, {
  "name": [(0, _i18n.default)("Heading 3")],
  "level": 3
}, {
  "name": [(0, _i18n.default)("Heading 4")],
  "level": 4
}, {
  "name": [(0, _i18n.default)("Title")],
  "customstyles": [{
    'stylename': [(0, _i18n.default)('Title')],
    'strong': true,
    'em': true,
    'color': 'Black'
  }]
}, {
  "name": [(0, _i18n.default)("Subtitle")],
  "customstyles": [{
    'stylename': [(0, _i18n.default)('Subtitle')],
    'strong': true,
    'em': true,
    'color': 'Grey'
  }]
}]; // https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.

exports.HEADING_NAMES = HEADING_NAMES;
const HeadingNodeSpec = { ..._ParagraphNodeSpec.default,
  attrs: { ..._ParagraphNodeSpec.default.attrs,
    level: {
      default: 1
    }
  },
  defining: true,
  parseDOM: [{
    tag: 'h1',
    getAttrs
  }, {
    tag: 'h2',
    getAttrs
  }, {
    tag: 'h3',
    getAttrs
  }, {
    tag: 'h4',
    getAttrs
  }, {
    tag: 'h5',
    getAttrs
  }, {
    tag: 'h6',
    getAttrs
  }],
  toDOM
};

function toDOM(node) {
  const dom = (0, _ParagraphNodeSpec.toParagraphDOM)(node);
  const level = node.attrs.level || 1;
  dom[0] = `h${level}`;
  return dom;
}

function getAttrs(dom) {
  const attrs = (0, _ParagraphNodeSpec.getParagraphNodeAttrs)(dom);
  const level = TAG_NAME_TO_LEVEL[dom.nodeName.toUpperCase()] || 1;
  attrs.level = level;
  return attrs;
}

var _default = HeadingNodeSpec;
exports.default = _default;