"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ColorEditor = _interopRequireDefault(require("./ui/ColorEditor"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

var _applyMark = _interopRequireDefault(require("./applyMark"));

var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));

var _findNodesWithSameMark = _interopRequireDefault(require("./findNodesWithSameMark"));

var _isTextStyleMarkCommandEnabled = _interopRequireDefault(require("./isTextStyleMarkCommandEnabled"));

var _nullthrows = _interopRequireDefault(require("nullthrows"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _MarkNames = require("./MarkNames");

var _prosemirrorTransform = require("prosemirror-transform");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TextColorCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "isEnabled", state => {
      return (0, _isTextStyleMarkCommandEnabled.default)(state, _MarkNames.MARK_TEXT_COLOR);
    });

    _defineProperty(this, "waitForUserInput", (state, dispatch, view, event) => {
      if (this._popUp) {
        return Promise.resolve(undefined);
      }

      const target = (0, _nullthrows.default)(event).currentTarget;

      if (!(target instanceof HTMLElement)) {
        return Promise.resolve(undefined);
      }

      const {
        doc,
        selection,
        schema
      } = state;
      const markType = schema.marks[_MarkNames.MARK_TEXT_COLOR];
      const anchor = event ? event.currentTarget : null;
      const {
        from,
        to
      } = selection;
      const result = (0, _findNodesWithSameMark.default)(doc, from, to, markType);
      const hex = result ? result.mark.attrs.color : null;
      return new Promise(resolve => {
        this._popUp = (0, _createPopUp.default)(_ColorEditor.default, {
          hex
        }, {
          anchor,
          onClose: val => {
            if (this._popUp) {
              this._popUp = null;
              resolve(val);
            }
          }
        });
      });
    });

    _defineProperty(this, "executeWithUserInput", (state, dispatch, view, color) => {
      if (dispatch && color !== undefined) {
        const {
          schema
        } = state;
        let {
          tr
        } = state;
        const markType = schema.marks[_MarkNames.MARK_TEXT_COLOR];
        const attrs = color ? {
          color
        } : null;
        tr = (0, _applyMark.default)(state.tr.setSelection(state.selection), schema, markType, attrs);

        if (tr.docChanged || tr.storedMarksSet) {
          // If selection is empty, the color is added to `storedMarks`, which
          // works like `toggleMark`
          // (see https://prosemirror.net/docs/ref/#commands.toggleMark).
          dispatch && dispatch(tr);
          return true;
        }
      }

      return false;
    });
  }

}

var _default = TextColorCommand;
exports.default = _default;