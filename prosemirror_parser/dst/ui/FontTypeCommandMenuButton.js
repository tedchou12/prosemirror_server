"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CommandMenuButton = _interopRequireDefault(require("./CommandMenuButton"));

var _FontTypeCommand = _interopRequireDefault(require("../FontTypeCommand"));

var React = _interopRequireWildcard(require("react"));

var _findActiveFontType = _interopRequireWildcard(require("./findActiveFontType"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _FontTypeMarkSpec = require("../FontTypeMarkSpec");

var _prosemirrorTransform = require("prosemirror-transform");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const FONT_TYPE_COMMANDS = {
  [_findActiveFontType.FONT_TYPE_NAME_DEFAULT]: new _FontTypeCommand.default('')
};

_FontTypeMarkSpec.FONT_TYPE_NAMES.forEach(name => {
  FONT_TYPE_COMMANDS[name] = new _FontTypeCommand.default(name);
});

const COMMAND_GROUPS = [FONT_TYPE_COMMANDS];

class FontTypeCommandMenuButton extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);
  }

  render() {
    const {
      dispatch,
      editorState,
      editorView
    } = this.props;
    const fontType = (0, _findActiveFontType.default)(editorState);
    return /*#__PURE__*/React.createElement(_CommandMenuButton.default, {
      className: "width-100" // [FS] IRAD-1008 2020-07-16
      // Disable font type menu on editor disable state
      ,
      disabled: editorView && editorView.disabled ? true : false,
      commandGroups: COMMAND_GROUPS,
      dispatch: dispatch,
      editorState: editorState,
      editorView: editorView,
      label: fontType
    });
  }

}

var _default = FontTypeCommandMenuButton;
exports.default = _default;