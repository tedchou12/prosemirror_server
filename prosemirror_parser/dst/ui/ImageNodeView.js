"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorView = require("prosemirror-view");

var _prosemirrorState = require("prosemirror-state");

var React = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _CustomNodeView = _interopRequireDefault(require("./CustomNodeView"));

var _EditorFrameset = require("./EditorFrameset");

var _Icon = _interopRequireDefault(require("./Icon"));

var _ImageInlineEditor = _interopRequireDefault(require("./ImageInlineEditor"));

var _ImageResizeBox = _interopRequireWildcard(require("./ImageResizeBox"));

var _PopUpPosition = require("./PopUpPosition");

var _ResizeObserver = _interopRequireDefault(require("./ResizeObserver"));

var _createPopUp = _interopRequireDefault(require("./createPopUp"));

var _resolveImage = _interopRequireDefault(require("./resolveImage"));

var _uuid = _interopRequireDefault(require("./uuid"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const EMPTY_SRC = 'data:image/gif;base64,' + 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
/* This value must be synced with the margin defined at .czi-image-view */

const IMAGE_MARGIN = 2;
const MAX_SIZE = 100000;
const IMAGE_PLACEHOLDER_SIZE = 24;
const DEFAULT_ORIGINAL_SIZE = {
  src: '',
  complete: false,
  height: 0,
  width: 0
};
const SIZE_OVERFLOW = 100; // Get the maxWidth that the image could be resized to.

function getMaxResizeWidth(el) {
  // Ideally, the image should bot be wider then its containing element.
  let node = el.parentElement;

  while (node && !node.offsetParent) {
    node = node.parentElement;
  }

  if (node && node.offsetParent && node.offsetParent.offsetWidth && node.offsetParent.offsetWidth > 0) {
    const {
      offsetParent
    } = node;
    const style = el.ownerDocument.defaultView.getComputedStyle(offsetParent);
    let width = offsetParent.clientWidth - IMAGE_MARGIN * 2;

    if (style.boxSizing === 'border-box') {
      const pl = parseInt(style.paddingLeft, 10);
      const pr = parseInt(style.paddingRight, 10);
      width -= pl + pr;
    }

    return Math.max(width, _ImageResizeBox.MIN_SIZE);
  } // Let the image resize freely.


  return MAX_SIZE;
}

function resolveURL(runtime, src) {
  if (!runtime) {
    return src;
  }

  const {
    canProxyImageSrc,
    getProxyImageSrc
  } = runtime;

  if (src && canProxyImageSrc && getProxyImageSrc && canProxyImageSrc(src)) {
    return getProxyImageSrc(src);
  }

  return src;
}

class ImageViewBody extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "_body", null);

    _defineProperty(this, "_id", (0, _uuid.default)());

    _defineProperty(this, "_inlineEditor", null);

    _defineProperty(this, "_mounted", false);

    _defineProperty(this, "state", {
      maxSize: {
        width: MAX_SIZE,
        height: MAX_SIZE,
        complete: false
      },
      originalSize: DEFAULT_ORIGINAL_SIZE
    });

    _defineProperty(this, "_resolveOriginalSize", async () => {
      if (!this._mounted) {
        // unmounted;
        return;
      }

      this.setState({
        originalSize: DEFAULT_ORIGINAL_SIZE
      });
      const src = this.props.node.attrs.src;
      const url = resolveURL(this.props.editorView.runtime, src);
      const originalSize = await (0, _resolveImage.default)(url);

      if (!this._mounted) {
        // unmounted;
        return;
      }

      if (this.props.node.attrs.src !== src) {
        // src had changed.
        return;
      } // [FS] IRAD-992 2020-06-25
      // Fix:Image exceeds the canvas


      const clientHeight = document.getElementsByClassName('czi-prosemirror-editor')[0].offsetHeight;

      if (originalSize.height > clientHeight) {
        originalSize.height = clientHeight - SIZE_OVERFLOW;
      }

      if (!originalSize.complete) {
        originalSize.width = _ImageResizeBox.MIN_SIZE;
        originalSize.height = _ImageResizeBox.MIN_SIZE;
      }

      this.setState({
        originalSize
      });
    });

    _defineProperty(this, "_onKeyDown", e => {
      console.log(e.keyCode);
    });

    _defineProperty(this, "_onResizeEnd", (width, height) => {
      const {
        getPos,
        node,
        editorView
      } = this.props;
      const pos = getPos();
      const attrs = { ...node.attrs,
        // TODO: Support UI for cropping later.
        crop: null,
        width,
        height
      };
      let tr = editorView.state.tr;
      const {
        selection
      } = editorView.state;
      tr = tr.setNodeMarkup(pos, null, attrs); // [FS] IRAD-1005 2020-07-09
      // Upgrade outdated packages.
      // reset selection to original using the latest doc.

      const origSelection = _prosemirrorState.NodeSelection.create(tr.doc, selection.from);

      tr = tr.setSelection(origSelection);
      editorView.dispatch(tr);
    });

    _defineProperty(this, "_onChange", value => {
      if (!this._mounted) {
        return;
      }

      const align = value ? value.align : null;
      const {
        getPos,
        node,
        editorView
      } = this.props;
      const pos = getPos();
      const attrs = { ...node.attrs,
        align
      };
      let tr = editorView.state.tr;
      const {
        selection
      } = editorView.state;
      tr = tr.setNodeMarkup(pos, null, attrs); // [FS] IRAD-1005 2020-07-09
      // Upgrade outdated packages.
      // reset selection to original using the latest doc.

      const origSelection = _prosemirrorState.NodeSelection.create(tr.doc, selection.from);

      tr = tr.setSelection(origSelection);
      editorView.dispatch(tr);
    });

    _defineProperty(this, "_onBodyRef", ref => {
      if (ref) {
        this._body = ref; // Mounting

        const el = _reactDom.default.findDOMNode(ref);

        if (el instanceof HTMLElement) {
          _ResizeObserver.default.observe(el, this._onBodyResize);
        }
      } else {
        // Unmounting.
        const el = this._body && _reactDom.default.findDOMNode(this._body);

        if (el instanceof HTMLElement) {
          _ResizeObserver.default.unobserve(el);
        }

        this._body = null;
      }
    });

    _defineProperty(this, "_onBodyResize", info => {
      const width = this._body ? getMaxResizeWidth(_reactDom.default.findDOMNode(this._body)) : MAX_SIZE;
      this.setState({
        maxSize: {
          width,
          height: MAX_SIZE,
          complete: !!this._body
        }
      });
    });
  }

  componentDidMount() {
    this._mounted = true;

    this._resolveOriginalSize();

    this._renderInlineEditor();
  }

  componentWillUnmount() {
    this._mounted = false;
    this._inlineEditor && this._inlineEditor.close();
    this._inlineEditor = null;
  }

  componentDidUpdate(prevProps) {
    const prevSrc = prevProps.node.attrs.src;
    const {
      node
    } = this.props;
    const {
      src
    } = node.attrs;

    if (prevSrc !== src) {
      // A new image is provided, resolve it.
      this._resolveOriginalSize();
    }

    this._renderInlineEditor();
  }

  render() {
    const {
      originalSize,
      maxSize
    } = this.state;
    const {
      editorView,
      node,
      selected,
      focused
    } = this.props;
    const {
      readOnly
    } = editorView;
    const {
      attrs
    } = node;
    const {
      align,
      crop,
      rotate
    } = attrs; // It's only active when the image's fully loaded.

    const loading = originalSize === DEFAULT_ORIGINAL_SIZE;
    const active = !loading && focused && !readOnly && originalSize.complete;
    const src = originalSize.complete ? originalSize.src : EMPTY_SRC;
    const aspectRatio = loading ? 1 : originalSize.width / originalSize.height;
    const error = !loading && !originalSize.complete;
    let {
      width,
      height
    } = attrs;

    if (loading) {
      width = width || IMAGE_PLACEHOLDER_SIZE;
      height = height || IMAGE_PLACEHOLDER_SIZE;
    }

    if (width && !height) {
      height = width / aspectRatio;
    } else if (height && !width) {
      width = height * aspectRatio;
    } else if (!width && !height) {
      width = originalSize.width;
      height = originalSize.height;
    }

    let scale = 1;

    if (width > maxSize.width && (!crop || crop.width > maxSize.width)) {
      // Scale image to fit its containing space.
      // If the image is not cropped.
      width = maxSize.width;
      height = width / aspectRatio;
      scale = maxSize.width / width;
    }

    const className = (0, _classnames.default)('czi-image-view-body', {
      active,
      error,
      focused,
      loading,
      selected
    });
    const resizeBox = active && !crop && !rotate ? /*#__PURE__*/React.createElement(_ImageResizeBox.default, {
      height: height,
      onResizeEnd: this._onResizeEnd,
      src: src,
      width: width
    }) : null;
    const imageStyle = {
      display: 'inline-block',
      height: height + 'px',
      left: '0',
      top: '0',
      width: width + 'px',
      position: 'relative'
    };
    const clipStyle = {};

    if (crop) {
      const cropped = { ...crop
      };

      if (scale !== 1) {
        scale = maxSize.width / cropped.width;
        cropped.width *= scale;
        cropped.height *= scale;
        cropped.left *= scale;
        cropped.top *= scale;
      }

      clipStyle.width = cropped.width + 'px';
      clipStyle.height = cropped.height + 'px';
      imageStyle.left = cropped.left + 'px';
      imageStyle.top = cropped.top + 'px';
    }

    if (rotate) {
      clipStyle.transform = `rotate(${rotate}rad)`;
    }

    const errorView = error ? _Icon.default.get('error') : null;
    const errorTitle = error ? `Unable to load image from ${attrs.src || ''}` : undefined;
    return /*#__PURE__*/React.createElement("span", {
      className: className,
      "data-active": active ? 'true' : undefined,
      "data-original-src": String(attrs.src),
      id: this._id,
      onKeyDown: this._onKeyDown,
      ref: this._onBodyRef,
      title: errorTitle
    }, /*#__PURE__*/React.createElement("span", {
      className: "czi-image-view-body-img-clip",
      style: clipStyle
    }, /*#__PURE__*/React.createElement("span", {
      style: imageStyle
    }, /*#__PURE__*/React.createElement("img", {
      alt: "",
      className: "czi-image-view-body-img",
      "data-align": align,
      height: height,
      id: `${this._id}-img`,
      src: src,
      width: width
    }), errorView)), resizeBox);
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
      onSelect: this._onChange
    };

    if (this._inlineEditor) {
      this._inlineEditor.update(editorProps);
    } else {
      this._inlineEditor = (0, _createPopUp.default)(_ImageInlineEditor.default, editorProps, {
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

class ImageNodeView extends _CustomNodeView.default {
  // @override
  createDOMElement() {
    const el = document.createElement('span');
    el.className = 'czi-image-view';

    this._updateDOM(el);

    return el;
  } // @override


  update(node, decorations) {
    super.update(node, decorations);

    this._updateDOM(this.dom);

    return true;
  } // @override


  renderReactComponent() {
    return /*#__PURE__*/React.createElement(ImageViewBody, this.props);
  }

  _updateDOM(el) {
    const {
      align
    } = this.props.node.attrs;
    let className = 'czi-image-view';

    if (align) {
      className += ' align-' + align;
    }

    el.className = className;
  }

}

var _default = ImageNodeView;
exports.default = _default;