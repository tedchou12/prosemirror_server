"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleEditorPaste;
var _prosemirrorView = require("prosemirror-view");
var _ImageUploadPlaceholderPlugin = require("../ImageUploadPlaceholderPlugin");
// workaround to support ClipboardEvent as a valid type.
// https://github.com/facebook/flow/issues/1856
function handleEditorPaste(view, event) {
  const {
    clipboardData
  } = event;
  if (!clipboardData) {
    return false;
  }
  const {
    files
  } = clipboardData;
  if (!files || !files.length) {
    return false;
  }
  const filesList = Array.from(files);
  if ((0, _ImageUploadPlaceholderPlugin.uploadImageFiles)(view, filesList)) {
    event.preventDefault();
    return true;
  }
  return false;
}