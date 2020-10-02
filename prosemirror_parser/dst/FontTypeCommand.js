"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _MarkNames = require("./MarkNames");

var _applyMark = _interopRequireDefault(require("./applyMark"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function setFontType(tr, schema, name) {
  const markType = schema.marks[_MarkNames.MARK_FONT_TYPE];

  if (!markType) {
    return tr;
  }

  const {
    selection
  } = tr;

  if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
    return tr;
  }

  const attrs = name ? {
    name
  } : null;
  tr = (0, _applyMark.default)(tr, schema, markType, attrs);
  return tr;
}

class FontTypeCommand extends _UICommand.default {
  constructor(name) {
    super();

    _defineProperty(this, "_label", null);

    _defineProperty(this, "_name", '');

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "renderLabel", state => {
      return this._label;
    });

    _defineProperty(this, "isEnabled", state => {
      const {
        schema,
        selection,
        tr
      } = state;

      if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
        return false;
      }

      const markType = schema.marks[_MarkNames.MARK_FONT_TYPE];

      if (!markType) {
        return false;
      }

      const {
        from,
        to
      } = selection;

      if (to === from + 1) {
        const node = tr.doc.nodeAt(from);

        if (node.isAtom && !node.isText && node.isLeaf) {
          // An atomic node (e.g. Image) is selected.
          return false;
        }
      }

      return true;
    });

    _defineProperty(this, "execute", (state, dispatch, view) => {
      const {
        schema,
        selection
      } = state;
      const tr = setFontType(state.tr.setSelection(selection), schema, this._name);

      if (tr.docChanged || tr.storedMarksSet) {
        // If selection is empty, the color is added to `storedMarks`, which
        // works like `toggleMark`
        // (see https://prosemirror.net/docs/ref/#commands.toggleMark).
        dispatch && dispatch(tr);
        return true;
      }

      return false;
    });

    this._name = name;
    this._label = name ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: name
      }
    }, name) : null;
  }

}

var _default = FontTypeCommand;
exports.default = _default;