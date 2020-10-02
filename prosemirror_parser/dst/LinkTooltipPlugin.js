"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _MarkNames = require("./MarkNames");

var _SelectionPlaceholderPlugin = require("./SelectionPlaceholderPlugin");

var _applyMark = _interopRequireDefault(require("./applyMark"));

var _findNodesWithSameMark = _interopRequireDefault(require("./findNodesWithSameMark"));

var _lookUpElement = _interopRequireDefault(require("./lookUpElement"));

var _LinkTooltip = _interopRequireDefault(require("./ui/LinkTooltip"));

var _LinkURLEditor = _interopRequireDefault(require("./ui/LinkURLEditor"));

var _PopUpPosition = require("./ui/PopUpPosition");

var _createPopUp = _interopRequireDefault(require("./ui/createPopUp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// https://prosemirror.net/examples/tooltip/
const SPEC = {
  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  key: new _prosemirrorState.PluginKey('LinkTooltipPlugin'),

  view(editorView) {
    return new LinkTooltipView(editorView);
  }

};

class LinkTooltipPlugin extends _prosemirrorState.Plugin {
  constructor() {
    super(SPEC);
  }

}

class LinkTooltipView {
  constructor(editorView) {
    _defineProperty(this, "_anchorEl", null);

    _defineProperty(this, "_popup", null);

    _defineProperty(this, "_editor", null);

    _defineProperty(this, "_onCancel", view => {
      this.destroy();
      view.focus();
    });

    _defineProperty(this, "_onClose", () => {
      this._anchorEl = null;
      this._editor = null;
      this._popup = null;
    });

    _defineProperty(this, "_onEdit", view => {
      if (this._editor) {
        return;
      }

      const {
        state
      } = view;
      const {
        schema,
        doc,
        selection
      } = state;
      const {
        from,
        to
      } = selection;
      const markType = schema.marks[_MarkNames.MARK_LINK];
      const result = (0, _findNodesWithSameMark.default)(doc, from, to, markType);

      if (!result) {
        return;
      }

      let {
        tr
      } = state;

      const linkSelection = _prosemirrorState.TextSelection.create(tr.doc, result.from.pos, result.to.pos + 1);

      tr = tr.setSelection(linkSelection);
      tr = (0, _SelectionPlaceholderPlugin.showSelectionPlaceholder)(state, tr);
      view.dispatch(tr);
      const href = result ? result.mark.attrs.href : null;
      this._editor = (0, _createPopUp.default)(_LinkURLEditor.default, {
        href
      }, {
        onClose: value => {
          this._editor = null;

          this._onEditEnd(view, selection, value);
        }
      });
    });

    _defineProperty(this, "_onRemove", view => {
      this._onEditEnd(view, view.state.selection, null);
    });

    _defineProperty(this, "_onEditEnd", (view, initialSelection, href) => {
      const {
        state,
        dispatch
      } = view;
      let tr = (0, _SelectionPlaceholderPlugin.hideSelectionPlaceholder)(state);

      if (href !== undefined) {
        const {
          schema
        } = state;
        const markType = schema.marks[_MarkNames.MARK_LINK];

        if (markType) {
          const result = (0, _findNodesWithSameMark.default)(tr.doc, initialSelection.from, initialSelection.to, markType);

          if (result) {
            const linkSelection = _prosemirrorState.TextSelection.create(tr.doc, result.from.pos, result.to.pos + 1);

            tr = tr.setSelection(linkSelection);
            const attrs = href ? {
              href
            } : null;
            tr = (0, _applyMark.default)(tr, schema, markType, attrs); // [FS] IRAD-1005 2020-07-09
            // Upgrade outdated packages.
            // reset selection to original using the latest doc.

            const origSelection = _prosemirrorState.TextSelection.create(tr.doc, initialSelection.from, initialSelection.to);

            tr = tr.setSelection(origSelection);
          }
        }
      }

      dispatch(tr);
      view.focus();
    });

    this.update(editorView, null);
  }

  update(view, lastState) {
    if (view.readOnly) {
      this.destroy();
      return;
    }

    const {
      state
    } = view;
    const {
      doc,
      selection,
      schema
    } = state;
    const markType = schema.marks[_MarkNames.MARK_LINK];

    if (!markType) {
      return;
    }

    const {
      from,
      to
    } = selection;
    const result = (0, _findNodesWithSameMark.default)(doc, from, to, markType);

    if (!result) {
      this.destroy();
      return;
    }

    const domFound = view.domAtPos(from);

    if (!domFound) {
      this.destroy();
      return;
    }

    const anchorEl = (0, _lookUpElement.default)(domFound.node, el => el.nodeName === 'A');

    if (!anchorEl) {
      this.destroy();
      return;
    }

    const popup = this._popup;
    const viewPops = {
      editorState: state,
      editorView: view,
      href: result.mark.attrs.href,
      onCancel: this._onCancel,
      onEdit: this._onEdit,
      onRemove: this._onRemove
    };

    if (popup && anchorEl === this._anchorEl) {
      popup.update(viewPops);
    } else {
      popup && popup.close();
      this._anchorEl = anchorEl;
      this._popup = (0, _createPopUp.default)(_LinkTooltip.default, viewPops, {
        anchor: anchorEl,
        autoDismiss: false,
        onClose: this._onClose,
        position: _PopUpPosition.atAnchorTopCenter
      });
    }
  }

  destroy() {
    this._popup && this._popup.close();
    this._editor && this._editor.close();
  }

}

var _default = LinkTooltipPlugin;
exports.default = _default;