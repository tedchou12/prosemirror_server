"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
const TextUnderlineMarkSpec = {
  parseDOM: [{
    tag: 'u'
  }, {
    style: 'text-decoration-line',
    getAttrs: value => {
      return value === 'underline' && null;
    }
  }, {
    style: 'text-decoration',
    getAttrs: value => {
      return value === 'underline' && null;
    }
  }],

  toDOM() {
    return ['u', 0];
  }

};
var _default = TextUnderlineMarkSpec;
exports.default = _default;