"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleEditorDrop;

var _prosemirrorView = require("prosemirror-view");

var _ImageUploadPlaceholderPlugin = require("../ImageUploadPlaceholderPlugin");

// https://prosemirror.net/examples/upload/
function handleEditorDrop(view, event) {
  const {
    dataTransfer
  } = event;

  if (!dataTransfer) {
    return false;
  }

  const {
    files
  } = dataTransfer;

  if (!files || !files.length) {
    return false;
  }

  const filesList = Array.from(files);
  const coords = {
    x: event.clientX,
    y: event.clientY
  };

  if ((0, _ImageUploadPlaceholderPlugin.uploadImageFiles)(view, filesList, coords)) {
    event.preventDefault();
    return true;
  }

  return false;
}