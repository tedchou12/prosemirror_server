"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PrintCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "isActive", state => {
      return false;
    });

    _defineProperty(this, "isEnabled", state => {
      return !!window.print;
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      if (dispatch && window.print) {
        window.print();
        return true;
      }

      return false;
    });
  }

}

var _default = PrintCommand;
exports.default = _default;