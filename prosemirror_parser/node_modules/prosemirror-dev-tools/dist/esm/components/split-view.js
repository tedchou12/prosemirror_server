import styled from "@emotion/styled";
import theme from "../theme";
export var SplitView = styled("div")({
  display: "flex",
  height: "100%"
});
SplitView.displayName = "SplitView";
export var SplitViewCol = styled("div")({
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
    borderLeft: sep ? "1px solid " + theme.main20 : "none",
    padding: noPaddings ? "" : "16px 18px 18px",
    minWidth: minWidth ? "".concat(minWidth, "px") : "none",
    maxWidth: maxWidth ? "".concat(maxWidth, "px") : "none"
  };
});
SplitViewCol.displayName = "SplitViewCol";