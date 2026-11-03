"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadingButton = exports.HeadingWithButton = exports.Heading = void 0;

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _theme = _interopRequireDefault(require("../theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Heading = (0, _styled["default"])("h2")({
  color: _theme["default"].softerMain,
  padding: 0,
  margin: 0,
  fontWeight: 400,
  letterSpacing: "1px",
  fontSize: "13px",
  textTransform: "uppercase",
  flexGrow: 1
});
exports.Heading = Heading;
Heading.displayName = "Heading";
var HeadingWithButton = (0, _styled["default"])("div")({
  display: "flex"
});
exports.HeadingWithButton = HeadingWithButton;
HeadingWithButton.displayName = "HeadingWithButton";
var HeadingButton = (0, _styled["default"])("button")({
  padding: "6px 10px",
  margin: "-6px -10px 0 8px",
  fontWeight: 400,
  letterSpacing: "1px",
  fontSize: "11px",
  color: _theme["default"].white80,
  textTransform: "uppercase",
  transition: "background 0.3s, color 0.3s",
  borderRadius: "2px",
  border: "none",
  background: "transparent",
  "&:hover": {
    background: _theme["default"].main40,
    color: _theme["default"].white,
    cursor: "pointer"
  },
  "&:focus": {
    outline: "none"
  },
  "&:active": {
    background: _theme["default"].main60
  }
});
exports.HeadingButton = HeadingButton;
HeadingButton.displayName = "HeadingButton";