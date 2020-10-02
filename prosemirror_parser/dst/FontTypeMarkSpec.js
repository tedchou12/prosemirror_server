"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preLoadFonts = preLoadFonts;
exports.default = exports.FONT_TYPE_NAMES = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _WebFontLoader = _interopRequireDefault(require("./WebFontLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// [FS] IRAD-1061 2020-09-19
// Now loaded locally, so that it work in closed network as well.
//import injectStyleSheet from './injectStyleSheet';
const FONT_TYPE_NAMES = [// SERIF
'Aclonica', 'Acme', 'Alegreya', //'Arial',//??? - Commented out fonts that are not available to download using https://fonts.googleapis.com/css?family=
'Arial Black', 'Georgia', 'Tahoma', 'Times New Roman', 'Times', 'Verdana', // MONOSPACE
'Courier New' //'Lucida Console',//???
//'Monaco',//???
//'monospace',//???
]; // FS IRAD-988 2020-06-18
// Preload fonts that are listed by default,
// so that even if the font is not available locally, load from web.

exports.FONT_TYPE_NAMES = FONT_TYPE_NAMES;

function preLoadFonts() {
  FONT_TYPE_NAMES.forEach(name => {
    loadAndCacheFont(name);
  });
}

function loadAndCacheFont(name) {
  // Cache custom fonts
  RESOLVED_FONT_NAMES.add(name); // https://github.com/typekit/webfontloader
  // [FS] IRAD-1061 2020-09-19
  // Now loaded locally, so that it work in closed network as well.
  //WebFontLoader.load({google: {families: [name]}});
} // resolve each font after it is loaded.


const RESOLVED_FONT_NAMES = new Set([]);
const FontTypeMarkSpec = {
  attrs: {
    name: ''
  },
  inline: true,
  group: 'inline',
  parseDOM: [{
    style: 'font-family',
    getAttrs: name => {
      return {
        name: name ? name.replace(/[\"\']/g, '') : ''
      };
    }
  }],

  toDOM(node) {
    const {
      name
    } = node.attrs;
    const attrs = {};

    if (name) {
      if (!RESOLVED_FONT_NAMES.has(name)) {
        loadAndCacheFont(name);
      }

      attrs.style = `font-family: ${name}`;
    }

    return ['span', attrs, 0];
  }

};
var _default = FontTypeMarkSpec;
exports.default = _default;