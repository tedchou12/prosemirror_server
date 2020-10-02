"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CommandMenuButton = _interopRequireDefault(require("./CommandMenuButton"));

var _HeadingCommand = _interopRequireDefault(require("../HeadingCommand"));

var _CustomStyleCommand = _interopRequireDefault(require("../CustomStyleCommand"));

var React = _interopRequireWildcard(require("react"));

var _findActiveHeading = require("./findActiveHeading");

var _findActiveCustomStyle = _interopRequireDefault(require("./findActiveCustomStyle"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _HeadingNodeSpec = require("../HeadingNodeSpec");

var _prosemirrorTransform = require("prosemirror-transform");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// [FS] IRAD-1042 2020-09-09
// To include custom styles in the toolbar
const HEADING_COMMANDS = {
  [_findActiveHeading.HEADING_NAME_DEFAULT]: new _HeadingCommand.default(0)
};

_HeadingNodeSpec.HEADING_NAMES.forEach(obj => {
  if (obj.level || obj.level === 0) {
    HEADING_COMMANDS[obj.name] = new _HeadingCommand.default(obj.level);
  } else {
    HEADING_COMMANDS[obj.name] = new _CustomStyleCommand.default(obj.customstyles, obj.name);
  }
});

const COMMAND_GROUPS = [HEADING_COMMANDS];

class HeadingCommandMenuButton extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);
  }

  findHeadingName(level) {
    for (var i = 0; i < _HeadingNodeSpec.HEADING_NAMES.length; i++) {
      if (_HeadingNodeSpec.HEADING_NAMES[i].level == level) {
        return _HeadingNodeSpec.HEADING_NAMES[i].name;
      }
    }
  }

  render() {
    const {
      dispatch,
      editorState,
      editorView
    } = this.props;
    var customStyleName;
    const headingLevel = (0, _findActiveHeading.findActiveHeading)(editorState);

    if (0 < headingLevel) {
      customStyleName = this.findHeadingName(headingLevel);
    } else {
      customStyleName = (0, _findActiveCustomStyle.default)(editorState);
    }

    return /*#__PURE__*/React.createElement(_CommandMenuButton.default, {
      className: "width-100" // [FS] IRAD-1008 2020-07-16
      // Disable font type menu on editor disable state
      ,
      disabled: editorView && editorView.disabled ? true : false,
      commandGroups: COMMAND_GROUPS,
      dispatch: dispatch,
      editorState: editorState,
      editorView: editorView,
      label: customStyleName
    });
  }

}

var _default = HeadingCommandMenuButton;
exports.default = _default;