"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfoPanel = void 0;

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _theme = _interopRequireDefault(require("../theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var InfoPanel = (0, _styled["default"])("div")({
  position: "relative",
  top: "50%",
  transform: "translateY(-50%)",
  textAlign: "center",
  color: _theme["default"].main,
  fontSize: "14px"
});
exports.InfoPanel = InfoPanel;
InfoPanel.displayName = "InfoPanel";