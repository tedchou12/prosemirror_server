import React from "react";
import Dock from "react-dock";
import styled from "@emotion/styled";
import { Tab, Tabs, TabList, TabPanel } from "./components/tabs";
import { Subscribe } from "unstated";
import GlobalStateContainer from "./state/global";
import EditorStateContainer from "./state/editor";
import StateTab from "./tabs/state";
import HistoryTab from "./tabs/history";
import SchemaTab from "./tabs/schema";
import PluginsTab from "./tabs/plugins";
import StructureTab from "./tabs/structure";
import SnapshotsTab from "./tabs/snapshots";
import CSSReset from "./components/css-reset";
import { NodePicker, NodePickerTrigger } from "./components/node-picker";
import SaveSnapshotButton from "./components/save-snapshot-button";
import theme from "./theme";
var DockContainer = styled("div")({
  width: "100%",
  height: "100%",
  overflow: "hidden",
  background: theme.mainBg,
  fontFamily: "Helvetica Neue, Calibri Light, Roboto, sans-serif",
  fontSize: "13px"
});
DockContainer.displayName = "DockContainer";
var CloseButton = styled("button")({
  background: "none",
  border: "none",
  position: "absolute",
  right: 0,
  color: theme.white60,
  fontSize: "18px",
  "&:hover": {
    cursor: "pointer",
    background: theme.white05,
    color: theme.white
  },
  "&:focus": {
    outline: "none"
  }
});
CloseButton.displayName = "CloseButton";
export default function DevToolsExpanded() {
  return /*#__PURE__*/React.createElement(Subscribe, {
    to: [GlobalStateContainer]
  }, function (globalState) {
    var _globalState$state = globalState.state,
        defaultSize = _globalState$state.defaultSize,
        tabIndex = _globalState$state.tabIndex;
    var toggleDevTools = globalState.toggleDevTools,
        updateBodyMargin = globalState.updateBodyMargin,
        selectTab = globalState.selectTab;
    return /*#__PURE__*/React.createElement(CSSReset, null, /*#__PURE__*/React.createElement(Subscribe, {
      to: [EditorStateContainer]
    }, function (_ref) {
      var nodePicker = _ref.state.nodePicker,
          deactivatePicker = _ref.deactivatePicker,
          updateNodePickerPossition = _ref.updateNodePickerPossition,
          nodePickerSelect = _ref.nodePickerSelect;
      return /*#__PURE__*/React.createElement(NodePicker, {
        nodePicker: nodePicker,
        onClose: deactivatePicker,
        onMouseMove: updateNodePickerPossition,
        onSelect: function onSelect(target) {
          nodePickerSelect(target);
          selectTab(0); // Switch to the "State" tab.
        }
      });
    }), /*#__PURE__*/React.createElement(Dock, {
      position: "bottom",
      dimMode: "none",
      isVisible: true,
      defaultSize: defaultSize,
      onSizeChange: updateBodyMargin
    }, function () {
      return /*#__PURE__*/React.createElement(DockContainer, null, /*#__PURE__*/React.createElement(CloseButton, {
        onClick: toggleDevTools
      }, "\xD7"), /*#__PURE__*/React.createElement(Subscribe, {
        to: [EditorStateContainer]
      }, function (_ref2) {
        var nodePicker = _ref2.state.nodePicker,
            deactivatePicker = _ref2.deactivatePicker,
            activatePicker = _ref2.activatePicker;
        return /*#__PURE__*/React.createElement(NodePickerTrigger, {
          onClick: nodePicker.active ? deactivatePicker : activatePicker,
          isActive: nodePicker.active
        });
      }), /*#__PURE__*/React.createElement(Subscribe, {
        to: [EditorStateContainer]
      }, function (_ref3) {
        var saveSnapshot = _ref3.saveSnapshot;
        return /*#__PURE__*/React.createElement(SaveSnapshotButton, {
          onClick: saveSnapshot
        }, "Save Snapshot");
      }), /*#__PURE__*/React.createElement(Tabs, {
        onSelect: selectTab,
        selectedIndex: tabIndex
      }, /*#__PURE__*/React.createElement(TabList, null, /*#__PURE__*/React.createElement(Tab, {
        index: "state"
      }, "State"), /*#__PURE__*/React.createElement(Tab, {
        index: "history"
      }, "History"), /*#__PURE__*/React.createElement(Tab, {
        index: "plugins"
      }, "Plugins"), /*#__PURE__*/React.createElement(Tab, {
        index: "schema"
      }, "Schema"), /*#__PURE__*/React.createElement(Tab, {
        index: "structure"
      }, "Structure"), /*#__PURE__*/React.createElement(Tab, {
        index: "snapshots"
      }, "Snapshots")), /*#__PURE__*/React.createElement(TabPanel, null, function (_ref4) {
        var index = _ref4.index;

        switch (index) {
          case "state":
            return /*#__PURE__*/React.createElement(StateTab, null);

          case "history":
            return /*#__PURE__*/React.createElement(HistoryTab, null);

          case "plugins":
            return /*#__PURE__*/React.createElement(PluginsTab, null);

          case "schema":
            return /*#__PURE__*/React.createElement(SchemaTab, null);

          case "structure":
            return /*#__PURE__*/React.createElement(StructureTab, null);

          case "snapshots":
            return /*#__PURE__*/React.createElement(SnapshotsTab, null);

          default:
            return /*#__PURE__*/React.createElement(StateTab, null);
        }
      })));
    }));
  });
}