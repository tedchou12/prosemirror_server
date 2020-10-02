"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorCommands = require("prosemirror-commands");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _findNodesWithSameMark = _interopRequireDefault(require("./findNodesWithSameMark"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MarkToggleCommand extends _UICommand.default {
  constructor(markName) {
    super();

    _defineProperty(this, "_markName", void 0);

    _defineProperty(this, "isActive", state => {
      const {
        schema,
        doc,
        selection
      } = state;
      const {
        from,
        to
      } = selection;
      const markType = schema.marks[this._markName];

      if (markType && from < to) {
        return !!(0, _findNodesWithSameMark.default)(doc, from, to - 1, markType);
      }

      return false;
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection,
        tr
      } = state;
      const markType = schema.marks[this._markName];

      if (!markType) {
        return false;
      }

      if (selection.empty && !(selection instanceof _prosemirrorState.TextSelection)) {
        return false;
      }

      const {
        from,
        to
      } = selection;

      if (tr && to === from + 1) {
        const node = tr.doc.nodeAt(from);

        if (node.isAtom && !node.isText && node.isLeaf) {
          // An atomic node (e.g. Image) is selected.
          return false;
        }
      } // TODO: Replace `toggleMark` with transform that does not change scroll
      // position.


      return (0, _prosemirrorCommands.toggleMark)(markType)(state, dispatch, view);
    });

    this._markName = markName;
  }

}

var _default = MarkToggleCommand;
exports.default = _default;