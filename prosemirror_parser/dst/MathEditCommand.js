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

var _CursorPlaceholderPlugin = require("./CursorPlaceholderPlugin");

var _NodeNames = require("./NodeNames");

var _MathEditor = _interopRequireDefault(require("./ui/MathEditor"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function insertMath(tr, schema, latex) {
  const {
    selection
  } = tr;

  if (!selection) {
    return tr;
  }

  const {
    from,
    to
  } = selection;

  if (from !== to) {
    return tr;
  }

  const image = schema.nodes[_NodeNames.MATH];

  if (!image) {
    return tr;
  }

  const attrs = {
    latex
  };
  const node = image.create(attrs, null, null);

  const frag = _prosemirrorModel.Fragment.from(node);

  tr = tr.insert(from, frag);
  return tr;
}

class MathEditCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "isEnabled", (state, view) => {
      const tr = state;
      const {
        selection
      } = tr;

      if (selection instanceof _prosemirrorState.TextSelection) {
        return selection.from === selection.to;
      }

      return false;
    });

    _defineProperty(this, "waitForUserInput", (state, dispatch, view, event) => {
      if (this._popUp) {
        return Promise.resolve(undefined);
      }

      if (dispatch) {
        dispatch((0, _CursorPlaceholderPlugin.showCursorPlaceholder)(state));
      }

      return new Promise(resolve => {
        const props = {
          runtime: view ? view.runtime : null,
          initialValue: null
        };
        this._popUp = (0, _createPopUp.default)(_MathEditor.default, props, {
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

    _defineProperty(this, "executeWithUserInput", (state, dispatch, view, latex) => {
      if (dispatch) {
        const {
          selection,
          schema
        } = state;
        let {
          tr
        } = state;
        tr = view ? (0, _CursorPlaceholderPlugin.hideCursorPlaceholder)(view.state) : tr;
        tr = tr.setSelection(selection);

        if (latex) {
          tr = insertMath(tr, schema, latex);
        }

        dispatch(tr);
        view && view.focus();
      }

      return false;
    });
  }

}

var _default = MathEditCommand;
exports.default = _default;