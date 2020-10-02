"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _styled = _interopRequireDefault(require("@emotion/styled"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var CSSReset = (0, _styled["default"])("div")({
  fontSize: "100%",
  lineHeight: 1,
  "& li + li": {
    margin: 0
  }
});
CSSReset.displayName = "CSSReset";
var _default = CSSReset;
exports["default"] = _default;