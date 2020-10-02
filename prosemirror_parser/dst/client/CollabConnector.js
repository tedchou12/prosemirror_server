"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorModel = require("prosemirror-model");

var _SimpleConnector = _interopRequireDefault(require("./SimpleConnector"));

var _EditorConnection = _interopRequireDefault(require("./EditorConnection"));

var _Reporter = _interopRequireDefault(require("./Reporter"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CollabConnector extends _SimpleConnector.default {
  constructor(editorState, setState, config) {
    super(editorState, setState);

    _defineProperty(this, "_clientID", void 0);

    _defineProperty(this, "_connected", void 0);

    _defineProperty(this, "_connection", void 0);

    _defineProperty(this, "_docID", void 0);

    _defineProperty(this, "_stepKeys", void 0);

    _defineProperty(this, "_selection", void 0);

    _defineProperty(this, "onEdit", transaction => {
      if (!this._connection.ready) {
        console.warn('not ready');
        return;
      }

      _reactDom.default.unstable_batchedUpdates(() => {
        this._connection.dispatch({
          type: 'transaction',
          transaction
        });
      });
    });

    _defineProperty(this, "updateSchema", schema => {
      // this._connection.updateSchema(schema);
      this._connection.ws_start();
    });

    const {
      docID
    } = config;
    this._docID = docID; // [FS][11-MAR-2020]
    // Modified the scripts to ensure not to always replace 3001 with 3002 to run both servers together,
    // instead used running hostname and configured port.
    // const url = window.location.protocol + '\/\/' +
    //   window.location.hostname + ':3002/docs/' +
    //   docID;
    // const url = window.location.protocol + '\/\/' + 'localhost.charlesproxy.com' + ':3002/docs/' + docID;

    const url = 'http://localhost.charlesproxy.com/prosemirror_server/server_5/docs/' + docID;
    this._connection = new _EditorConnection.default(setState, new _Reporter.default(), docID);
    this._connection.view = {
      updateState: s => {
        // console.log('update', s);
        //poll if selection changes
        // if (this._connection.ready) {
        //   if (this._selection != s.selection) {
        //     this._selection = s.selection;
        //     this._connection.cursor_send(s.selection);
        //   }
        // }
        setState({
          editorState: s
        }, () => {});
      }
    };
  }

}

var _default = CollabConnector;
exports.default = _default;