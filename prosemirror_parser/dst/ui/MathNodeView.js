"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CustomNodeView = _interopRequireDefault(require("./CustomNodeView"));

var _MathInlineEditor = _interopRequireDefault(require("./MathInlineEditor"));

var React = _interopRequireWildcard(require("react"));

var _createPopUp = _interopRequireDefault(require("./createPopUp"));

var _classnames = _interopRequireDefault(require("classnames"));

var _renderLaTeXAsHTML = _interopRequireDefault(require("./renderLaTeXAsHTML"));

var _uuid = _interopRequireDefault(require("./uuid"));

var _prosemirrorView = require("prosemirror-view");

var _EditorFrameset = require("./EditorFrameset");

var _prosemirrorModel = require("prosemirror-model");

var _PopUpPosition = require("./PopUpPosition");

var _prosemirrorState = require("prosemirror-state");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const EMPTY_SRC = 'data:image/gif;base64,' + 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

class MathViewBody extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "state", {
      isEditing: false
    });

    _defineProperty(this, "_inlineEditor", null);

    _defineProperty(this, "_id", (0, _uuid.default)());

    _defineProperty(this, "_mounted", false);

    _defineProperty(this, "_onEditStart", () => {
      this.setState({
        isEditing: true
      });
    });

    _defineProperty(this, "_onEditEnd", () => {
      this.setState({
        isEditing: false
      });
    });

    _defineProperty(this, "_onChange", value => {
      if (!this._mounted) {
        return;
      }

      const align = value ? value.align : null;
      const latex = value ? value.latex : null;
      const {
        getPos,
        node,
        editorView
      } = this.props;
      const pos = getPos();
      const attrs = { ...node.attrs,
        latex,
        align
      };
      let tr = editorView.state.tr;
      const {
        selection
      } = editorView.state;
      tr = tr.setNodeMarkup(pos, null, attrs); // [FS] IRAD-1005 2020-07-23
      // Upgrade outdated packages.
      // reset selection to original using the latest doc.

      const origSelection = _prosemirrorState.NodeSelection.create(tr.doc, selection.from);

      tr = tr.setSelection(origSelection);
      editorView.dispatch(tr);
    });
  }

  componentDidMount() {
    this._mounted = true;

    this._renderInlineEditor();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  componentDidUpdate(prevProps) {
    this._renderInlineEditor();
  }

  render() {
    // TODO: Resolve `readOnly`;
    const readOnly = false;
    const {
      node,
      selected,
      focused
    } = this.props;
    const {
      attrs
    } = node;
    const {
      latex
    } = attrs;
    const {
      isEditing
    } = this.state;
    const active = (focused || isEditing) && !readOnly;
    const className = (0, _classnames.default)('czi-math-view-body', {
      active,
      selected
    });
    const html = (0, _renderLaTeXAsHTML.default)(latex);
    return /*#__PURE__*/React.createElement("span", {
      className: className,
      "data-active": active ? 'true' : null,
      "data-latex": latex || '',
      id: this._id,
      title: latex
    }, /*#__PURE__*/React.createElement("img", {
      alt: latex,
      className: "czi-math-view-body-img",
      src: EMPTY_SRC,
      title: latex
    }), /*#__PURE__*/React.createElement("span", {
      className: "czi-math-view-body-content",
      dangerouslySetInnerHTML: {
        __html: html
      }
    }));
  }

  _renderInlineEditor() {
    const el = document.getElementById(this._id);

    if (!el || el.getAttribute('data-active') !== 'true') {
      this._inlineEditor && this._inlineEditor.close();
      return;
    }

    const {
      node
    } = this.props;
    const editorProps = {
      value: node.attrs,
      onSelect: this._onChange,
      onEditStart: this._onEditStart,
      onEditEnd: this._onEditEnd
    };

    if (this._inlineEditor) {
      this._inlineEditor.update(editorProps);
    } else {
      this._inlineEditor = (0, _createPopUp.default)(_MathInlineEditor.default, editorProps, {
        anchor: el,
        autoDismiss: false,
        container: el.closest(`.${_EditorFrameset.FRAMESET_BODY_CLASSNAME}`),
        position: _PopUpPosition.atAnchorBottomCenter,
        onClose: () => {
          this._inlineEditor = null;
        }
      });
    }
  }

}

class MathNodeView extends _CustomNodeView.default {
  // @override
  createDOMElement() {
    const el = document.createElement('span');
    el.className = 'czi-math-view';

    this._updateDOM(el);

    return el;
  } // @override


  update(node, decorations) {
    super.update(node, decorations);

    this._updateDOM(this.dom);

    return true;
  } // @override


  renderReactComponent() {
    return /*#__PURE__*/React.createElement(MathViewBody, this.props);
  }

  _updateDOM(el) {
    const {
      align
    } = this.props.node.attrs;
    let className = 'czi-math-view';

    if (align) {
      className += ' align-' + align;
    }

    el.className = className;
  }

}

var _default = MathNodeView;
exports.default = _default;