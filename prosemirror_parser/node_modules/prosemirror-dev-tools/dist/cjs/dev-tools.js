"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DevTools;

var _react = _interopRequireDefault(require("react"));

var _unstated = require("unstated");

var _global = _interopRequireDefault(require("./state/global"));

var _devToolsCollapsed = _interopRequireDefault(require("./dev-tools-collapsed"));

var _devToolsExpanded = _interopRequireDefault(require("./dev-tools-expanded"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function DevTools() {
  return /*#__PURE__*/_react["default"].createElement(_unstated.Subscribe, {
    to: [_global["default"]]
  }, function (_ref) {
    var state = _ref.state,
        toggleDevTools = _ref.toggleDevTools;
    return state.opened ? /*#__PURE__*/_react["default"].createElement(_devToolsExpanded["default"], null) : /*#__PURE__*/_react["default"].createElement(_devToolsCollapsed["default"], {
      onClick: toggleDevTools
    });
  });
}