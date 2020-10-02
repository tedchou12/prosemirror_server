"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nullthrows = _interopRequireDefault(require("nullthrows"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTables = require("prosemirror-tables");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _ColorEditor = _interopRequireDefault(require("./ui/ColorEditor"));

var _PopUpPosition = require("./ui/PopUpPosition");

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const setCellBorderBlack = (0, _prosemirrorTables.setCellAttr)('borderColor', '#000000');

class TableBorderColorCommand extends _UICommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "shouldRespondToUIEvent", e => {
      return e.type === _UICommand.default.EventType.MOUSEENTER;
    });

    _defineProperty(this, "isEnabled", state => {
      return setCellBorderBlack(state.tr);
    });

    _defineProperty(this, "waitForUserInput", (state, dispatch, view, event) => {
      if (this._popUp) {
        return Promise.resolve(undefined);
      }

      const target = (0, _nullthrows.default)(event).currentTarget;

      if (!(target instanceof HTMLElement)) {
        return Promise.resolve(undefined);
      }

      const anchor = event ? event.currentTarget : null;
      return new Promise(resolve => {
        this._popUp = (0, _createPopUp.default)(_ColorEditor.default, null, {
          anchor,
          position: _PopUpPosition.atAnchorRight,
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
        const cmd = (0, _prosemirrorTables.setCellAttr)('borderColor', color);
        cmd(state, dispatch, view);
        return true;
      }

      return false;
    });
  }

  cancel() {
    this._popUp && this._popUp.close(undefined);
  }

}

var _default = TableBorderColorCommand;
exports.default = _default;