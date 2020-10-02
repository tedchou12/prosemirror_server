"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _CustomButton = _interopRequireDefault(require("./CustomButton"));

var _LoadingIndicator = _interopRequireDefault(require("./LoadingIndicator"));

var _preventEventDefault = _interopRequireDefault(require("./preventEventDefault"));

var _uuid = _interopRequireDefault(require("./uuid"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ImageUploadEditor extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_img", null);

    _defineProperty(this, "_unmounted", false);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "state", {
      error: null,
      id: (0, _uuid.default)(),
      pending: false
    });

    _defineProperty(this, "_onSelectFile", event => {
      const file = event.target.files && event.target.files[0];

      if (file && typeof file === 'object') {
        this._upload(file);
      }
    });

    _defineProperty(this, "_onSuccess", image => {
      if (this._unmounted) {
        return;
      }

      this.props.close(image);
    });

    _defineProperty(this, "_onError", error => {
      if (this._unmounted) {
        return;
      }

      this.setState({
        error,
        id: (0, _uuid.default)(),
        pending: false
      });
    });

    _defineProperty(this, "_upload", async file => {
      try {
        const runtime = this.props.runtime || {};
        const {
          canUploadImage,
          uploadImage
        } = runtime;

        if (!canUploadImage || !uploadImage || !canUploadImage()) {
          throw new Error('feature is not available');
        }

        this.setState({
          pending: true,
          error: null
        });
        const image = await uploadImage(file);

        this._onSuccess(image);
      } catch (ex) {
        this._onError(ex);
      }
    });

    _defineProperty(this, "_cancel", () => {
      this.props.close();
    });
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const {
      id,
      error,
      pending
    } = this.state;
    const className = (0, _classnames.default)('czi-image-upload-editor', {
      pending,
      error
    });
    let label = 'Choose an image file...';

    if (pending) {
      label = /*#__PURE__*/React.createElement(_LoadingIndicator.default, null);
    } else if (error) {
      label = 'Something went wrong, please try again';
    }

    return /*#__PURE__*/React.createElement("div", {
      className: className
    }, /*#__PURE__*/React.createElement("form", {
      className: "czi-form",
      onSubmit: _preventEventDefault.default
    }, /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement("legend", null, "Upload Image"), /*#__PURE__*/React.createElement("div", {
      className: "czi-image-upload-editor-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-image-upload-editor-label"
    }, label), /*#__PURE__*/React.createElement("input", {
      accept: "image/png,image/gif,image/jpeg,image/jpg",
      className: "czi-image-upload-editor-input",
      disabled: pending,
      id: id,
      key: id,
      onChange: this._onSelectFile,
      type: "file"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "czi-form-buttons"
    }, /*#__PURE__*/React.createElement(_CustomButton.default, {
      label: "Cancel",
      onClick: this._cancel
    }))));
  }

}

var _default = ImageUploadEditor;
exports.default = _default;