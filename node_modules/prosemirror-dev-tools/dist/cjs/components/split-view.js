"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SplitViewCol = exports.SplitView = void 0;

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _theme = _interopRequireDefault(require("../theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SplitView = (0, _styled["default"])("div")({
  display: "flex",
  height: "100%"
});
exports.SplitView = SplitView;
SplitView.displayName = "SplitView";
var SplitViewCol = (0, _styled["default"])("div")({
  boxSizing: "border-box",
  height: "100%",
  overflow: "scroll"
}, function (_ref) {
  var grow = _ref.grow,
      sep = _ref.sep,
      noPaddings = _ref.noPaddings,
      minWidth = _ref.minWidth,
      maxWidth = _ref.maxWidth;
  return {
    flexGrow: grow ? 1 : 0,
    borderLeft: sep ? "1px solid " + _theme["default"].main20 : "none",
    padding: noPaddings ? "" : "16px 18px 18px",
    minWidth: minWidth ? "".concat(minWidth, "px") : "none",
    maxWidth: maxWidth ? "".concat(maxWidth, "px") : "none"
  };
});
exports.SplitViewCol = SplitViewCol;
SplitViewCol.displayName = "SplitViewCol";