"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _SetDocAttrStep = _interopRequireDefault(require("./SetDocAttrStep"));

var _DocLayoutEditor = _interopRequireDefault(require("./ui/DocLayoutEditor"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function setDocLayout(tr, schema, width, layout) {
  const {
    doc
  } = tr;

  if (!doc) {
    return tr;
  }

  tr = tr.step(new _SetDocAttrStep.default('width', width || null));
  tr = tr.step(new _SetDocAttrStep.default('layout', layout || null));
  return tr;
}

class DocLayoutCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "isEnabled", state => {
      return true;
    });

    _defineProperty(this, "isActive", state => {
      return !!this._popUp;
    });

    _defineProperty(this, "waitForUserInput", (state, dispatch, view, event) => {
      if (this._popUp) {
        return Promise.resolve(undefined);
      }

      const {
        doc
      } = state;
      return new Promise(resolve => {
        const props = {
          initialValue: doc.attrs
        };
        this._popUp = (0, _createPopUp.default)(_DocLayoutEditor.default, props, {
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

    _defineProperty(this, "executeWithUserInput", (state, dispatch, view, inputs) => {
      if (dispatch) {
        const {
          selection,
          schema
        } = state;
        let {
          tr
        } = state; // tr = view ? hideCursorPlaceholder(view.state) : tr;

        tr = tr.setSelection(selection);

        if (inputs) {
          const {
            width,
            layout
          } = inputs;
          tr = setDocLayout(tr, schema, width, layout);
        }

        dispatch(tr);
        view && view.focus();
      }

      return false;
    });
  }

}

var _default = DocLayoutCommand;
exports.default = _default;