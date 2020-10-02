"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _createEmptyEditorState = _interopRequireDefault(require("../createEmptyEditorState"));

var _Editor = _interopRequireDefault(require("./Editor"));

var _EditorFrameset = _interopRequireDefault(require("./EditorFrameset"));

var _EditorToolbar = _interopRequireDefault(require("./EditorToolbar"));

var _Frag = _interopRequireDefault(require("./Frag"));

var _uuid = _interopRequireDefault(require("./uuid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const EMPTY_EDITOR_RUNTIME = {};

class RichTextEditor extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "state", void 0);

    _defineProperty(this, "_id", void 0);

    _defineProperty(this, "_dispatchTransaction", tr => {
      const {
        onChange,
        editorState,
        readOnly
      } = this.props;

      if (readOnly === true) {
        return;
      }

      if (onChange) {
        // [FS-AFQ][20-FEB-2020]
        // Collaboration
        onChange({
          state: editorState || _Editor.default.EDITOR_EMPTY_STATE,
          transaction: tr
        });
      }
    });

    _defineProperty(this, "_onReady", editorView => {
      if (editorView !== this.state.editorView) {
        this.setState({
          editorView
        });
        const {
          onReady
        } = this.props;
        onReady && onReady(editorView);
      }
    });

    this._id = (0, _uuid.default)();
    this.state = {
      contentHeight: NaN,
      contentOverflowHidden: false,
      editorView: null
    };
  }

  render() {
    const {
      autoFocus,
      children,
      className,
      disabled,
      embedded,
      header,
      height,
      onChange,
      nodeViews,
      placeholder,
      readOnly,
      width
    } = this.props;
    let {
      editorState,
      runtime
    } = this.props;
    editorState = editorState || (0, _createEmptyEditorState.default)();
    runtime = runtime || EMPTY_EDITOR_RUNTIME;
    const {
      editorView
    } = this.state;
    const toolbar = !!readOnly === true ? null : /*#__PURE__*/React.createElement(_EditorToolbar.default, {
      disabled: disabled,
      dispatchTransaction: this._dispatchTransaction,
      editorState: editorState || _Editor.default.EDITOR_EMPTY_STATE,
      editorView: editorView,
      readOnly: readOnly
    });
    const body = /*#__PURE__*/React.createElement(_Frag.default, null, /*#__PURE__*/React.createElement(_Editor.default, {
      autoFocus: autoFocus,
      disabled: disabled,
      dispatchTransaction: this._dispatchTransaction,
      editorState: editorState,
      embedded: embedded,
      id: this._id,
      nodeViews: nodeViews,
      onChange: onChange,
      onReady: this._onReady,
      placeholder: placeholder,
      readOnly: readOnly,
      runtime: runtime
    }), children);
    return /*#__PURE__*/React.createElement(_EditorFrameset.default, {
      body: body,
      className: className,
      embedded: embedded,
      header: header,
      height: height,
      toolbar: toolbar,
      width: width
    });
  }

}

var _default = RichTextEditor;
exports.default = _default;