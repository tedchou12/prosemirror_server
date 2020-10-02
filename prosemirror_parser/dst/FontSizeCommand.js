"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

var _applyMark = _interopRequireDefault(require("./applyMark"));

var _isTextStyleMarkCommandEnabled = _interopRequireDefault(require("./isTextStyleMarkCommandEnabled"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _MarkNames = require("./MarkNames");

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorTransform = require("prosemirror-transform");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function setFontSize(tr, schema, pt) {
  const markType = schema.marks[_MarkNames.MARK_FONT_SIZE];

  if (!markType) {
    return tr;
  }

  const attrs = pt ? {
    pt
  } : null;
  tr = (0, _applyMark.default)(tr, schema, markType, attrs);
  return tr;
}

class FontSizeCommand extends _UICommand.default {
  constructor(pt) {
    super();

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "_pt", 0);

    _defineProperty(this, "isEnabled", state => {
      return (0, _isTextStyleMarkCommandEnabled.default)(state, _MarkNames.MARK_FONT_SIZE);
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = setFontSize(state.tr.setSelection(selection), schema, this._pt);

      if (tr.docChanged || tr.storedMarksSet) {
        // If selection is empty, the color is added to `storedMarks`, which
        // works like `toggleMark`
        // (see https://prosemirror.net/docs/ref/#commands.toggleMark).
        dispatch && dispatch(tr);
        return true;
      }

      return false;
    });

    this._pt = pt;
  }

}

var _default = FontSizeCommand;
exports.default = _default;