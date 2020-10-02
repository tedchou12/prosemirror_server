"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isListNode;

var _prosemirrorModel = require("prosemirror-model");

var _isBulletListNode = _interopRequireDefault(require("./isBulletListNode"));

var _isOrderedListNode = _interopRequireDefault(require("./isOrderedListNode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isListNode(node) {
  if (node instanceof _prosemirrorModel.Node) {
    return (0, _isBulletListNode.default)(node) || (0, _isOrderedListNode.default)(node);
  }

  return false;
}