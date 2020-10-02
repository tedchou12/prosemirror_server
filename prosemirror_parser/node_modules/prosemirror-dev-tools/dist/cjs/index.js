"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyDevTools = applyDevTools;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _unstated = require("unstated");

var _devTools = _interopRequireDefault(require("./dev-tools"));

var _editor = _interopRequireDefault(require("./state/editor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var DEVTOOLS_CLASS_NAME = "__prosemirror-dev-tools__";

function createPlace() {
  var place = document.querySelector(".".concat(DEVTOOLS_CLASS_NAME));

  if (!place) {
    place = document.createElement("div");
    place.className = DEVTOOLS_CLASS_NAME;
    document.body.appendChild(place);
  } else {
    _reactDom["default"].unmountComponentAtNode(place);

    place.innerHTML = "";
  }

  return place;
}

function applyDevTools(editorView, props) {
  var place = createPlace();
  var editorState = new _editor["default"](editorView, props);

  _reactDom["default"].render( /*#__PURE__*/_react["default"].createElement(_unstated.Provider, {
    inject: [editorState]
  }, /*#__PURE__*/_react["default"].createElement(_devTools["default"], null)), place);
}

var _default = applyDevTools;
exports["default"] = _default;