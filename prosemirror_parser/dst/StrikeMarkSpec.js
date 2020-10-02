"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
const StrikeMarkSpec = {
  parseDOM: [{
    style: 'text-decoration',
    getAttrs: value => {
      return value === 'line-through' && null;
    }
  }],

  toDOM() {
    const style = 'text-decoration: line-through';
    return ['span', {
      style
    }, 0];
  }

};
var _default = StrikeMarkSpec;
exports.default = _default;