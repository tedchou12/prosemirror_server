"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _CommandMenuButton = _interopRequireDefault(require("./CommandMenuButton"));

var _EditorToolbarConfig = require("./EditorToolbarConfig");

var _Icon = _interopRequireDefault(require("./Icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TableCellMenu extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_menu", null);

    _defineProperty(this, "props", void 0);
  }

  render() {
    const {
      editorState,
      editorView
    } = this.props;
    return /*#__PURE__*/React.createElement(_CommandMenuButton.default, {
      className: "czi-table-cell-menu",
      commandGroups: _EditorToolbarConfig.TABLE_COMMANDS_GROUP,
      dispatch: editorView.dispatch,
      editorState: editorState,
      editorView: editorView,
      icon: _Icon.default.get('edit'),
      title: "Edit"
    });
  }

}

var _default = TableCellMenu;
exports.default = _default;