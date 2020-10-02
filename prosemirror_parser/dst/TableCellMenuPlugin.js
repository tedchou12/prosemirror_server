"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _findActionableCell = _interopRequireDefault(require("./findActionableCell"));

var _PopUpPosition = require("./ui/PopUpPosition");

var _TableCellMenu = _interopRequireDefault(require("./ui/TableCellMenu"));

var _bindScrollHandler = _interopRequireDefault(require("./ui/bindScrollHandler"));

var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));

var _isElementFullyVisible = _interopRequireDefault(require("./ui/isElementFullyVisible"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TableCellTooltipView {
  constructor(editorView) {
    _defineProperty(this, "_cellElement", void 0);

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "_scrollHandle", null);

    _defineProperty(this, "destroy", () => {
      this._popUp && this._popUp.close();
      this._popUp = null;
    });

    _defineProperty(this, "_onOpen", () => {
      const cellEl = this._cellElement;

      if (!cellEl) {
        return;
      }

      this._scrollHandle = (0, _bindScrollHandler.default)(cellEl, this._onScroll);
    });

    _defineProperty(this, "_onClose", () => {
      this._popUp = null;
      this._scrollHandle && this._scrollHandle.dispose();
      this._scrollHandle = null;
    });

    _defineProperty(this, "_onScroll", () => {
      const popUp = this._popUp;
      const cellEl = this._cellElement;

      if (!popUp || !cellEl) {
        return;
      }

      if (!(0, _isElementFullyVisible.default)(cellEl)) {
        popUp.close();
      }
    });

    this.update(editorView, null);
  }

  update(view, lastState) {
    const {
      state,
      readOnly
    } = view;
    const result = (0, _findActionableCell.default)(state);

    if (!result || readOnly) {
      this.destroy();
      return;
    } // These is screen coordinate.


    const domFound = view.domAtPos(result.pos + 1);

    if (!domFound) {
      this.destroy();
      return;
    }

    let cellEl = domFound.node;
    const popUp = this._popUp;
    const viewPops = {
      editorState: state,
      editorView: view
    };

    if (cellEl && !(0, _isElementFullyVisible.default)(cellEl)) {
      cellEl = null;
    }

    if (!cellEl) {
      // Closes the popup.
      popUp && popUp.close();
      this._cellElement = null;
    } else if (popUp && cellEl === this._cellElement) {
      // Updates the popup.
      popUp.update(viewPops);
    } else {
      // Creates a new popup.
      popUp && popUp.close();
      this._cellElement = cellEl; // [FS] IRAD-1009 2020-07-16
      // Does not allow Table Menu Popuup button in disable mode

      if (!view.disabled) {
        this._popUp = (0, _createPopUp.default)(_TableCellMenu.default, viewPops, {
          anchor: cellEl,
          autoDismiss: false,
          onClose: this._onClose,
          position: _PopUpPosition.atAnchorTopRight
        });

        this._onOpen();
      }
    }
  }

} // https://prosemirror.net/examples/tooltip/


const SPEC = {
  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  key: new _prosemirrorState.PluginKey('TableCellMenuPlugin'),

  view(editorView) {
    return new TableCellTooltipView(editorView);
  }

};

class TableCellMenuPlugin extends _prosemirrorState.Plugin {
  constructor() {
    super(SPEC);
  }

}

var _default = TableCellMenuPlugin;
exports.default = _default;