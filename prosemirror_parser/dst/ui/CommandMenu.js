"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _CustomMenu = _interopRequireDefault(require("./CustomMenu"));

var _CustomMenuItem = _interopRequireDefault(require("./CustomMenuItem"));

var _UICommand = _interopRequireDefault(require("./UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CommandMenu extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_activeCommand", null);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_onUIEnter", (command, event) => {
      if (command.shouldRespondToUIEvent(event)) {
        this._activeCommand && this._activeCommand.cancel();
        this._activeCommand = command;

        this._execute(command, event);
      }
    });

    _defineProperty(this, "_execute", (command, e) => {
      const {
        dispatch,
        editorState,
        editorView,
        onCommand
      } = this.props;

      if (command.execute(editorState, dispatch, editorView, e)) {
        onCommand && onCommand();
      }
    });
  }

  render() {
    const {
      commandGroups,
      editorState,
      editorView
    } = this.props;
    const children = [];
    const jj = commandGroups.length - 1;
    commandGroups.forEach((group, ii) => {
      Object.keys(group).forEach(label => {
        const command = group[label];
        let disabled = true;

        try {
          disabled = !editorView || !command.isEnabled(editorState, editorView);
        } catch (ex) {
          disabled = false;
        }

        children.push( /*#__PURE__*/React.createElement(_CustomMenuItem.default, {
          active: command.isActive(editorState),
          disabled: disabled,
          key: label,
          label: command.renderLabel(editorState) || label,
          onClick: this._onUIEnter,
          onMouseEnter: this._onUIEnter,
          value: command
        }));
      });

      if (ii !== jj) {
        children.push( /*#__PURE__*/React.createElement(_CustomMenuItem.default.Separator, {
          key: `${String(ii)}-hr`
        }));
      }
    });
    return /*#__PURE__*/React.createElement(_CustomMenu.default, null, children);
  }

}

var _default = CommandMenu;
exports.default = _default;