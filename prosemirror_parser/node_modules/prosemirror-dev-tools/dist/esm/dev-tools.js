import React from "react";
import { Subscribe } from "unstated";
import GlobalStateContainer from "./state/global";
import DevToolsCollapsed from "./dev-tools-collapsed";
import DevToolsExpanded from "./dev-tools-expanded";
export default function DevTools() {
  return /*#__PURE__*/React.createElement(Subscribe, {
    to: [GlobalStateContainer]
  }, function (_ref) {
    var state = _ref.state,
        toggleDevTools = _ref.toggleDevTools;
    return state.opened ? /*#__PURE__*/React.createElement(DevToolsExpanded, null) : /*#__PURE__*/React.createElement(DevToolsCollapsed, {
      onClick: toggleDevTools
    });
  });
}