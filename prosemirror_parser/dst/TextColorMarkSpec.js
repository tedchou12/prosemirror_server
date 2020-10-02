"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _toCSSColor = _interopRequireDefault(require("./ui/toCSSColor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TextColorMarkSpec = {
  attrs: {
    color: ''
  },
  inline: true,
  group: 'inline',
  parseDOM: [{
    style: 'color',
    getAttrs: color => {
      return {
        color: (0, _toCSSColor.default)(color)
      };
    }
  }],

  toDOM(node) {
    const {
      color
    } = node.attrs;
    let style = '';

    if (color) {
      style += `color: ${color};`;
    }

    return ['span', {
      style
    }, 0];
  }

};
var _default = TextColorMarkSpec;
exports.default = _default;