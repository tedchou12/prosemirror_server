"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

var _ImageSourceCommand = _interopRequireDefault(require("./ImageSourceCommand"));

var _ImageUploadEditor = _interopRequireDefault(require("./ui/ImageUploadEditor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ImageUploadCommand extends _ImageSourceCommand.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "isEnabled", (state, view) => {
      if (!view) {
        return false;
      }

      const {
        runtime
      } = view;

      if (!runtime) {
        return false;
      }

      const {
        canUploadImage,
        uploadImage
      } = runtime;

      if (!canUploadImage || !uploadImage) {
        return false;
      }

      if (!canUploadImage()) {
        return false;
      }

      return this.__isEnabled(state, view);
    });
  }

  getEditor() {
    return _ImageUploadEditor.default;
  }

}

var _default = ImageUploadCommand;
exports.default = _default;