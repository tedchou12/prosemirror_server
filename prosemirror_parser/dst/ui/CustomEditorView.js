"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorView = require("prosemirror-view");

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
class CustomEditorView extends _prosemirrorView.EditorView {
  constructor(place, props) {
    super(place, props);

    _defineProperty(this, "disabled", void 0);

    _defineProperty(this, "placeholder", void 0);

    _defineProperty(this, "readOnly", void 0);

    _defineProperty(this, "runtime", void 0);

    this.runtime = null;
    this.readOnly = true;
    this.disabled = true;
    this.placeholder = null;
  }

  destroy() {
    super.destroy();
    this._props = {};
  }

}

var _default = CustomEditorView;
exports.default = _default;