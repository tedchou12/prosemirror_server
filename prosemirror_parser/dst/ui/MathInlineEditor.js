"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

var _CustomEditorView = _interopRequireDefault(require("./CustomEditorView"));

var _MathEditor = _interopRequireDefault(require("./MathEditor"));

var React = _interopRequireWildcard(require("react"));

var _createPopUp = _interopRequireDefault(require("./createPopUp"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const MathAlignValues = {
  NONE: {
    value: null,
    text: 'Inline'
  },
  CENTER: {
    value: 'center',
    text: 'Break text'
  }
};

class MathInlineEditor extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_popUp", null);

    _defineProperty(this, "_onClick", align => {
      const value = this.props.value || {};
      this.props.onSelect({ ...value,
        align
      });
    });

    _defineProperty(this, "_editLatex", latex => {
      if (this._popUp) {
        return;
      }

      const {
        editorView,
        value
      } = this.props;
      const props = {
        runtime: editorView ? editorView.runtime : null,
        initialValue: value && value.latex || ''
      };
      this._popUp = (0, _createPopUp.default)(_MathEditor.default, props, {
        autoDismiss: false,
        modal: true,
        onClose: latex => {
          if (this._popUp) {
            this._popUp = null;

            if (latex !== undefined) {
              const value = this.props.value || {};
              this.props.onSelect({ ...value,
                latex
              });
            }

            this.props.onEditEnd();
          }
        }
      });
      this.props.onEditStart();
    });
  }

  componentWillUnmount() {
    this._popUp && this._popUp.close();
  }

  render() {
    const {
      align,
      latex
    } = this.props.value || {};
    const onClick = this._onClick;
    const buttons = Object.keys(MathAlignValues).map(key => {
      const {
        value,
        text
      } = MathAlignValues[key];
      return /*#__PURE__*/React.createElement(_CustomButton.default, {
        active: align === value,
        key: key,
        label: text,
        onClick: onClick,
        value: value
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-inline-editor"
    }, buttons, /*#__PURE__*/React.createElement(_CustomButton.default, {
      key: "edit",
      label: "Edit",
      onClick: this._editLatex,
      value: latex || ''
    }));
  }

}

var _default = MathInlineEditor;
exports.default = _default;