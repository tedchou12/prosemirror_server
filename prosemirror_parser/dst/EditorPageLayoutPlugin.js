"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _DocNodeSpec = require("./DocNodeSpec");

const SPEC = {
  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  key: new _prosemirrorState.PluginKey('EditorPageLayoutPlugin'),
  props: {
    attributes: renderAttributes
  }
};

function renderAttributes(editorState) {
  const {
    doc
  } = editorState;
  const attrs = {
    class: 'czi-prosemirror-editor'
  };
  const {
    width,
    padding,
    layout
  } = doc.attrs;
  let style = '';
  let computedLayout;

  if (width) {
    const inWidth = width / 72;
    const cmWidth = inWidth * 2.54;

    if (!computedLayout && inWidth >= 10.9 && inWidth <= 11.1) {
      // Round up to letter size.
      computedLayout = _DocNodeSpec.LAYOUT.US_LETTER_LANDSCAPE;
    } else if (!computedLayout && inWidth >= 8.4 && inWidth <= 8.6) {
      // Round up to letter size.
      computedLayout = _DocNodeSpec.LAYOUT.US_LETTER_PORTRAIT;
    } else if (!computedLayout && cmWidth >= 29.5 && cmWidth <= 30.1) {
      // Round up to letter size.
      computedLayout = _DocNodeSpec.LAYOUT.A4_LANDSCAPE;
    } else if (!computedLayout && cmWidth >= 20.5 && cmWidth <= 21.5) {
      // Round up to letter size.
      computedLayout = _DocNodeSpec.LAYOUT.A4_PORTRAIT;
    } else {
      // Use custom width (e.g. imported from google doc).
      style += `width: ${width}pt;`;
    }

    if (padding) {
      style += `padding-left: ${padding}pt;`;
      style += `padding-right: ${padding}pt;`;
    }

    attrs.style = style;
  } else {
    computedLayout = layout;
  }

  if (computedLayout) {
    attrs[_DocNodeSpec.ATTRIBUTE_LAYOUT] = computedLayout;
  }

  return attrs;
} // Unfortunately the root node `doc` does not supoort `toDOM`, thus
// we'd have to assign its `attributes` manually.


class EditorPageLayoutPlugin extends _prosemirrorState.Plugin {
  constructor() {
    super(SPEC);
  }

}

var _default = EditorPageLayoutPlugin;
exports.default = _default;