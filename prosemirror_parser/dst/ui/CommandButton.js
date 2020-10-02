"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

var _UICommand = _interopRequireDefault(require("./UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CommandButton extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_onUIEnter", (command, event) => {
      if (command.shouldRespondToUIEvent(event)) {
        this._execute(command, event);
      }
    });

    _defineProperty(this, "_execute", (value, event) => {
      const {
        command,
        editorState,
        dispatch,
        editorView
      } = this.props;
      command.execute(editorState, dispatch, editorView, event);
    });
  }

  render() {
    const {
      label,
      className,
      command,
      editorState,
      editorView,
      icon,
      title
    } = this.props;
    let disabled = this.props.disabled;

    if (!!disabled === false) {
      disabled = !editorView || !command.isEnabled(editorState, editorView);
    }

    return /*#__PURE__*/React.createElement(_CustomButton.default, {
      active: command.isActive(editorState),
      className: className,
      disabled: disabled,
      icon: icon,
      label: label,
      onClick: this._onUIEnter,
      onMouseEnter: this._onUIEnter,
      title: title,
      value: command
    });
  }

}

var _default = CommandButton;
exports.default = _default;