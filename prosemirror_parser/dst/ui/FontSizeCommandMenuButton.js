"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FONT_PT_SIZES = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _FontSizeCommand = _interopRequireDefault(require("../FontSizeCommand"));

var _CommandMenuButton = _interopRequireDefault(require("./CommandMenuButton"));

var _findActiveFontSize = _interopRequireDefault(require("./findActiveFontSize"));

var _i18n = _interopRequireDefault(require("./i18n"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const FONT_PT_SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 90];
exports.FONT_PT_SIZES = FONT_PT_SIZES;
const FONT_PT_SIZE_COMMANDS = FONT_PT_SIZES.reduce((memo, size) => {
  memo[` ${size} `] = new _FontSizeCommand.default(size);
  return memo;
}, {});
const COMMAND_GROUPS = [{
  [(0, _i18n.default)('Default')]: new _FontSizeCommand.default(0)
}, FONT_PT_SIZE_COMMANDS];

class FontSizeCommandMenuButton extends React.PureComponent {
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
    const fontSize = (0, _findActiveFontSize.default)(editorState);
    const className = String(fontSize).length <= 2 ? 'width-30' : 'width-60';
    return /*#__PURE__*/React.createElement(_CommandMenuButton.default, {
      className: className // [FS] IRAD-1008 2020-07-16
      // Disable font size menu on editor disable state
      ,
      disabled: editorView && editorView.disabled ? true : false,
      commandGroups: COMMAND_GROUPS,
      dispatch: dispatch,
      editorState: editorState,
      editorView: editorView,
      label: fontSize
    });
  }

}

var _default = FontSizeCommandMenuButton;
exports.default = _default;