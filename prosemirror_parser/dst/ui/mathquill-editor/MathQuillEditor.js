"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var MathQuillEditorSymbols = _interopRequireWildcard(require("./MathQuillEditorSymbols"));

var _MathQuillEditorSymbolsPanel = _interopRequireDefault(require("./MathQuillEditorSymbolsPanel"));

var React = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _canUseCSSFont = _interopRequireDefault(require("./../canUseCSSFont"));

var _classnames = _interopRequireDefault(require("classnames"));

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// [FS] IRAD-1010 2020-07-24
// With the latest to generate export default MathQuill these options need to be passed into exports loader
// Moved this from webpack config to here, so that package could load fine with other application.
const MQLoader = require('exports-loader?exports=default|MathQuill&type=module!node-mathquill/build/mathquill.js');

const MathQuill = MQLoader.default;
const MQ = MathQuill.getInterface(2);
const CSS_CDN_URL = '//cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.css';
const CSS_FONT = 'Symbola';

(async function () {
  const fontSupported = await (0, _canUseCSSFont.default)(CSS_FONT);

  if (!fontSupported) {
    console.info('Add CSS from ', CSS_CDN_URL); // [FS] IRAD-1061 2020-09-19
    // Now loaded locally, so that it work in closed network as well.
    //injectStyleSheet(CSS_CDN_URL);
  } // injectStyleSheet(CSS_CDN_URL);

})();

class MathQuillElement extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-mathquill-editor-element",
      dangerouslySetInnerHTML: {
        __html: this.props.value
      }
    });
  }

}

class MathQuillEditor extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_element", null);

    _defineProperty(this, "_ignoreEditEvents", 4);

    _defineProperty(this, "_mathField", null);

    _defineProperty(this, "_latex", '');

    _defineProperty(this, "_renderPanel", (symbols, ii) => {
      return /*#__PURE__*/React.createElement(_MathQuillEditorSymbolsPanel.default, {
        key: `s${ii}`,
        onSelect: this._onSymbolSelect,
        symbols: symbols
      });
    });

    _defineProperty(this, "_onSymbolSelect", symbol => {
      const {
        latex,
        cmd
      } = symbol;
      const mathField = this._mathField;

      if (!mathField || !cmd || !latex) {
        return;
      }

      if (cmd === 'write') {
        mathField.write(latex);
      } else if (cmd === 'cmd') {
        mathField.cmd(latex);
      }

      mathField.focus();
    });

    _defineProperty(this, "_onEdit", mathField => {
      if (this._ignoreEditEvents > 0) {
        this._ignoreEditEvents -= 1;
        return;
      }

      const {
        onChange
      } = this.props;
      const latex = mathField.latex();
      this._latex = latex;
      onChange && onChange(latex);
    });

    _defineProperty(this, "_onElementRef", ref => {
      if (ref) {
        this._element = _reactDom.default.findDOMNode(ref);
      } else {
        this._element = null;
      }
    });
  }

  render() {
    const {
      value
    } = this.props;
    const panels = [MathQuillEditorSymbols.OPERATORS, MathQuillEditorSymbols.STRUCTURE, MathQuillEditorSymbols.SYMBOLS, MathQuillEditorSymbols.TRIG].map(this._renderPanel);
    const empty = !value;
    const className = (0, _classnames.default)('czi-mathquill-editor', {
      empty
    });
    return /*#__PURE__*/React.createElement("div", {
      className: className
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-mathquill-editor-main"
    }, /*#__PURE__*/React.createElement(MathQuillElement, {
      ref: this._onElementRef
    })), /*#__PURE__*/React.createElement("div", {
      className: "czi-mathquill-editor-side"
    }, panels));
  }

  componentDidUpdate() {
    const mathField = this._mathField;

    if (this._latex !== this.props.value && mathField) {
      mathField.latex(this.props.value || ' ');
    }
  }

  componentDidMount() {
    const config = {
      autoCommands: 'pi theta sqrt sum',
      autoOperatorNames: 'sin cos',
      restrictMismatchedBrackets: true,
      handlers: {
        edit: this._onEdit
      }
    };
    const mathField = MQ.MathField(this._element, config);
    this._mathField = mathField; // TODO: Remove this if MathQuill supports `\displaystyle`.

    const rawLatex = (this.props.value || '').replace(/\\displaystyle/g, '');
    mathField.latex(rawLatex || ' ');
    mathField.focus();

    if (rawLatex && !mathField.latex()) {
      console.error('unable to process latex', rawLatex);
    }
  }

}

var _default = MathQuillEditor;
exports.default = _default;