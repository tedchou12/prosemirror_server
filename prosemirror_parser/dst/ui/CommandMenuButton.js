"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _CommandMenu = _interopRequireDefault(require("./CommandMenu"));

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

var _UICommand = _interopRequireDefault(require("./UICommand"));

var _createPopUp = _interopRequireDefault(require("./createPopUp"));

var _uuid = _interopRequireDefault(require("./uuid"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CommandMenuButton extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_menu", null);

    _defineProperty(this, "_id", (0, _uuid.default)());

    _defineProperty(this, "state", {
      expanded: false
    });

    _defineProperty(this, "_onClick", () => {
      const expanded = !this.state.expanded;
      this.setState({
        expanded
      });
      expanded ? this._showMenu() : this._hideMenu();
    });

    _defineProperty(this, "_hideMenu", () => {
      const menu = this._menu;
      this._menu = null;
      menu && menu.close();
    });

    _defineProperty(this, "_showMenu", () => {
      const menu = this._menu;
      const menuProps = { ...this.props,
        onCommand: this._onCommand
      };

      if (menu) {
        menu.update(menuProps);
      } else {
        this._menu = (0, _createPopUp.default)(_CommandMenu.default, menuProps, {
          anchor: document.getElementById(this._id),
          onClose: this._onClose
        });
      }
    });

    _defineProperty(this, "_onCommand", () => {
      this.setState({
        expanded: false
      });

      this._hideMenu();
    });

    _defineProperty(this, "_onClose", () => {
      if (this._menu) {
        this.setState({
          expanded: false
        });
        this._menu = null;
      }
    });
  }

  render() {
    const {
      className,
      label,
      commandGroups,
      editorState,
      editorView,
      icon,
      disabled,
      title
    } = this.props;
    const enabled = !disabled && commandGroups.some((group, ii) => {
      return Object.keys(group).some(label => {
        const command = group[label];
        let disabledVal = true;

        try {
          disabledVal = !editorView || !command.isEnabled(editorState, editorView);
        } catch (ex) {
          disabledVal = false;
        }

        return !disabledVal;
      });
    });
    const {
      expanded
    } = this.state;
    const buttonClassName = (0, _classnames.default)(className, {
      'czi-custom-menu-button': true,
      expanded
    });
    return /*#__PURE__*/React.createElement(_CustomButton.default, {
      className: buttonClassName,
      disabled: !enabled,
      icon: icon,
      id: this._id,
      label: label,
      onClick: this._onClick,
      title: title
    });
  }

  componentWillUnmount() {
    this._hideMenu();
  }

}

var _default = CommandMenuButton;
exports.default = _default;