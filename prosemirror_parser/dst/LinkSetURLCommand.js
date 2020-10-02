"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _MarkNames = require("./MarkNames");

var _SelectionPlaceholderPlugin = require("./SelectionPlaceholderPlugin");

var _applyMark = _interopRequireDefault(require("./applyMark"));

var _findNodesWithSameMark = _interopRequireDefault(require("./findNodesWithSameMark"));

var _LinkURLEditor = _interopRequireDefault(require("./ui/LinkURLEditor"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class LinkSetURLCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "isEnabled", state => {
      if (!(state.selection instanceof _prosemirrorState.TextSelection)) {
        // Could be a NodeSelection or CellSelection.
        return false;
      }

      const markType = state.schema.marks[_MarkNames.MARK_LINK];

      if (!markType) {
        return false;
      }

      const {
        from,
        to
      } = state.selection;
      return from < to;
    });

    _defineProperty(this, "waitForUserInput", (state, dispatch, view, event) => {
      if (this._popUp) {
        return Promise.resolve(undefined);
      }

      if (dispatch) {
        dispatch((0, _SelectionPlaceholderPlugin.showSelectionPlaceholder)(state));
      }

      const {
        doc,
        schema,
        selection
      } = state;
      const markType = schema.marks[_MarkNames.MARK_LINK];

      if (!markType) {
        return Promise.resolve(undefined);
      }

      const {
        from,
        to
      } = selection;
      const result = (0, _findNodesWithSameMark.default)(doc, from, to, markType);
      const href = result ? result.mark.attrs.href : null;
      return new Promise(resolve => {
        this._popUp = (0, _createPopUp.default)(_LinkURLEditor.default, {
          href
        }, {
          modal: true,
          onClose: val => {
            if (this._popUp) {
              this._popUp = null;
              resolve(val);
            }
          }
        });
      });
    });

    _defineProperty(this, "executeWithUserInput", (state, dispatch, view, href) => {
      if (dispatch) {
        const {
          selection,
          schema
        } = state;
        let {
          tr
        } = state;
        tr = view ? (0, _SelectionPlaceholderPlugin.hideSelectionPlaceholder)(view.state) : tr;
        tr = tr.setSelection(selection);

        if (href !== undefined) {
          const markType = schema.marks[_MarkNames.MARK_LINK];
          const attrs = href ? {
            href
          } : null;
          tr = (0, _applyMark.default)(tr.setSelection(state.selection), schema, markType, attrs);
        }

        dispatch(tr);
      }

      view && view.focus();
      return true;
    });
  }

}

var _default = LinkSetURLCommand;
exports.default = _default;