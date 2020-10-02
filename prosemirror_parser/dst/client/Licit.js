"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorDevTools = _interopRequireDefault(require("prosemirror-dev-tools"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _convertFromJSON = _interopRequireDefault(require("../convertFromJSON"));

var _RichTextEditor = _interopRequireDefault(require("../ui/RichTextEditor"));

var _uuid = _interopRequireDefault(require("../uuid"));

var _LicitRuntime = _interopRequireDefault(require("./LicitRuntime"));

var _SimpleConnector = _interopRequireDefault(require("./SimpleConnector"));

var _CollabConnector = _interopRequireDefault(require("./CollabConnector"));

var _createEmptyEditorState = require("../createEmptyEditorState");

var _createPopUp = _interopRequireDefault(require("../ui/createPopUp"));

var _PopUpPosition = require("../ui/PopUpPosition");

var _AlertInfo = _interopRequireDefault(require("../ui/AlertInfo"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * LICIT properties:
 *  docID {number} [0] Collaborative Doument ID
 *  debug {boolean} [false] To enable/disable ProseMirror Debug Tools, available only in development.
 *  width {string} [100%] Width of the editor.
 *  height {height} [100%] Height of the editor.
 *  readOnly {boolean} [false] To enable/disable editing mode.
 *  onChange {@callback} [null] Fires after each significant change.
 *      @param data {JSON} Modified document data.
 *  onReady {@callback} [null] Fires when the editor is fully ready.
 *      @param ref {LICIT} Rerefence of the editor.
 *  data {JSON} [null] Document data to be loaded into the editor.
 *  disabled {boolean} [false] Disable the editor.
 *  embedded {boolean} [false] Disable/Enable inline behaviour.
 *  plugins [plugins] External Plugins into the editor.
 */
class Licit extends React.Component {
  // This will be handy in updating document's content.
  // Flag to decide whether to skip shouldComponentUpdate
  constructor(_props, context) {
    super(_props, context);

    _defineProperty(this, "_runtime", void 0);

    _defineProperty(this, "_connector", void 0);

    _defineProperty(this, "_clientID", void 0);

    _defineProperty(this, "_editorView", void 0);

    _defineProperty(this, "_skipSCU", void 0);

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "setContent", (content = {}) => {
      const {
        doc,
        tr,
        schema
      } = this._connector.getState();

      const document = content ? schema.nodeFromJSON(content) : schema.nodeFromJSON(_createEmptyEditorState.EMPTY_DOC_JSON);

      const selection = _prosemirrorState.TextSelection.create(doc, 0, doc.content.size);

      const transaction = tr.setSelection(selection).replaceSelectionWith(document, false);
      this._skipSCU = true;

      this._editorView.dispatch(transaction);
    });

    _defineProperty(this, "_onChange", data => {
      const {
        transaction
      } = data;
      let isEmpty = false;

      this._connector.onEdit(transaction);

      if (transaction.docChanged) {
        const docJson = transaction.doc.toJSON();

        if (docJson.content && docJson.content.length === 1) {
          if (docJson.content[0].content && '' === docJson.content[0].content[0].text.trim()) {
            isEmpty = true;
          }
        }

        this.state.onChangeCB(docJson, isEmpty);
      }
    });

    _defineProperty(this, "_onReady", editorView => {
      // [FS][06-APR-2020][IRAD-922]
      // Showing focus in the editor.
      const {
        state,
        dispatch
      } = editorView;
      this._editorView = editorView;
      const tr = state.tr;
      const doc = state.doc;
      dispatch(tr.setSelection(_prosemirrorState.TextSelection.create(doc, 0, doc.content.size)));
      editorView.focus();

      if (this.state.onReadyCB) {
        this.state.onReadyCB(this);
      }

      if (this.state.debug) {
        window.debugProseMirror = () => {
          (0, _prosemirrorDevTools.default)(editorView);
        };

        window.debugProseMirror();
      }
    });

    _defineProperty(this, "setProps", props => {
      if (this.state.readOnly) {
        // It should be possible to load content into the editor in readonly as well.
        // It should not be necessary to make the component writable any time during the process
        let propsCopy = {};
        this._skipSCU = true;
        Object.assign(propsCopy, props); // make writable without content change

        propsCopy.readOnly = false;
        delete propsCopy.data;
        this.setState(propsCopy);
      } // Need to go through shouldComponentUpdate lifecycle here, when updated from outside,
      // so that content is modified gracefully using transaction so that undo/redo works too.


      this._skipSCU = false;
      this.setState(props);
    });

    this._clientID = (0, _uuid.default)();
    this._editorView = null;
    this._skipSCU = true;

    const noop = function () {}; // [FS] IRAD-981 2020-06-10
    // Component's configurations.


    const docID = _props.docID || 0; // 0 < means collaborative.

    const collaborative = 0 < docID;
    const debug = _props.debug || false; // Default width and height to undefined

    const width = _props.width || undefined;
    const height = _props.height || undefined;
    const onChangeCB = typeof _props.onChange === 'function' ? _props.onChange : noop;
    const onReadyCB = typeof _props.onReady === 'function' ? _props.onReady : noop;
    const readOnly = _props.readOnly || false;

    const _data = _props.data || null;

    const disabled = _props.disabled || false;
    const embedded = _props.embedded || false; // [FS] IRAD-996 2020-06-30
    // [FS] 2020-07-03
    // Handle Image Upload from Angular App

    const runtime = _props.runtime ? _props.runtime : new _LicitRuntime.default();
    const plugins = _props.plugins || null;
    let editorState = (0, _convertFromJSON.default)(_data, null, plugins); // [FS] IRAD-1067 2020-09-19
    // The editorState will return null if the doc Json is mal-formed

    if (null === editorState) {
      editorState = (0, _convertFromJSON.default)(_createEmptyEditorState.EMPTY_DOC_JSON, null, plugins);
      this.showAlert();
    }

    const setState = this.setState.bind(this);
    this._connector = collaborative ? new _CollabConnector.default(editorState, setState, {
      docID
    }) : new _SimpleConnector.default(editorState, setState); // FS IRAD-989 2020-18-06
    // updating properties should automatically render the changes

    this.state = {
      docID,
      data: _data,
      editorState,
      width,
      height,
      readOnly,
      onChangeCB,
      onReadyCB,
      debug,
      disabled,
      embedded,
      runtime
    }; // FS IRAD-1040 2020-26-08
    // Get the modified schema from editorstate and send it to collab server

    if (this._connector.updateSchema) {
      this._connector.updateSchema(this.state.editorState.schema);
    }
  } // [FS] IRAD-1067 2020-09-19
  // Alert funtion to show document is corrupted


  showAlert() {
    const anchor = null;
    this._popUp = (0, _createPopUp.default)(_AlertInfo.default, null, {
      anchor,
      position: _PopUpPosition.atViewportCenter,
      onClose: val => {
        if (this._popUp) {
          this._popUp = null;
        }
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only interested if properties are set from outside.
    if (!this._skipSCU) {
      this._skipSCU = false;
      let dataChanged = false; // Compare data, if found difference, update editorState

      if (this.state.data !== nextState.data) {
        dataChanged = true;
      } else if (null === nextState.data) {
        if (this.state.editorState.doc.textContent && 0 < this.state.editorState.doc.textContent.trim().length) {
          dataChanged = true;
        }
      }

      if (dataChanged) {
        // data changed, so update document content
        this.setContent(nextState.data);
      }

      if (this.state.docID !== nextState.docID) {
        // Collaborative mode changed
        const collabEditing = nextState.docID != 0;

        const editorState = this._connector.getState();

        const setState = this.setState.bind(this);
        const docID = nextState.docID || 1; // create new connector

        this._connector = collabEditing ? new _CollabConnector.default(editorState, setState, {
          docID
        }) : new _SimpleConnector.default(editorState, setState);
      }
    }

    return true;
  }

  render() {
    const {
      editorState,
      width,
      height,
      readOnly,
      disabled,
      embedded,
      runtime
    } = this.state; // [FS] IRAD-978 2020-06-05
    // Using 100vw & 100vh (100% viewport) is not ideal for a component which is expected to be a part of a page,
    // so changing it to 100%  width & height which will occupy the area relative to its parent.

    return /*#__PURE__*/React.createElement(_RichTextEditor.default, {
      editorState: editorState,
      embedded: embedded,
      height: height,
      onChange: this._onChange,
      onReady: this._onReady,
      readOnly: readOnly,
      runtime: runtime,
      width: width,
      disabled: disabled
    });
  }

}

var _default = Licit;
exports.default = _default;