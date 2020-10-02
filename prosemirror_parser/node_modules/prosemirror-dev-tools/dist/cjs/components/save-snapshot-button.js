"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _theme = _interopRequireDefault(require("../theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SaveSnapshotButton = (0, _styled["default"])("div")({
  position: "absolute",
  right: "32px",
  top: "-28px",
  color: _theme["default"].white,
  background: _theme["default"].main60,
  fontSize: "12px",
  lineHeight: "25px",
  padding: "0 6px",
  height: "24px",
  backgroundSize: "20px 20px",
  backgroundRepeat: "none",
  backgroundPosition: "50% 50%",
  borderRadius: "3px",
  "&:hover": {
    backgroundColor: _theme["default"].main80,
    cursor: "pointer"
  }
});
SaveSnapshotButton.displayName = "SaveSnapshotButton";
var _default = SaveSnapshotButton;
exports["default"] = _default;