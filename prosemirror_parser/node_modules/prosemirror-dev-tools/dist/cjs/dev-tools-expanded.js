"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DevToolsExpanded;

var _react = _interopRequireDefault(require("react"));

var _reactDock = _interopRequireDefault(require("react-dock"));

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _tabs = require("./components/tabs");

var _unstated = require("unstated");

var _global = _interopRequireDefault(require("./state/global"));

var _editor = _interopRequireDefault(require("./state/editor"));

var _state = _interopRequireDefault(require("./tabs/state"));

var _history = _interopRequireDefault(require("./tabs/history"));

var _schema = _interopRequireDefault(require("./tabs/schema"));

var _plugins = _interopRequireDefault(require("./tabs/plugins"));

var _structure = _interopRequireDefault(require("./tabs/structure"));

var _snapshots = _interopRequireDefault(require("./tabs/snapshots"));

var _cssReset = _interopRequireDefault(require("./components/css-reset"));

var _nodePicker = require("./components/node-picker");

var _saveSnapshotButton = _interopRequireDefault(require("./components/save-snapshot-button"));

var _theme = _interopRequireDefault(require("./theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var DockContainer = (0, _styled["default"])("div")({
  width: "100%",
  height: "100%",
  overflow: "hidden",
  background: _theme["default"].mainBg,
  fontFamily: "Helvetica Neue, Calibri Light, Roboto, sans-serif",
  fontSize: "13px"
});
DockContainer.displayName = "DockContainer";
var CloseButton = (0, _styled["default"])("button")({
  background: "none",
  border: "none",
  position: "absolute",
  right: 0,
  color: _theme["default"].white60,
  fontSize: "18px",
  "&:hover": {
    cursor: "pointer",
    background: _theme["default"].white05,
    color: _theme["default"].white
  },
  "&:focus": {
    outline: "none"
  }
});
CloseButton.displayName = "CloseButton";

function DevToolsExpanded() {
  return /*#__PURE__*/_react["default"].createElement(_unstated.Subscribe, {
    to: [_global["default"]]
  }, function (globalState) {
    var _globalState$state = globalState.state,
        defaultSize = _globalState$state.defaultSize,
        tabIndex = _globalState$state.tabIndex;
    var toggleDevTools = globalState.toggleDevTools,
        updateBodyMargin = globalState.updateBodyMargin,
        selectTab = globalState.selectTab;
    return /*#__PURE__*/_react["default"].createElement(_cssReset["default"], null, /*#__PURE__*/_react["default"].createElement(_unstated.Subscribe, {
      to: [_editor["default"]]
    }, function (_ref) {
      var nodePicker = _ref.state.nodePicker,
          deactivatePicker = _ref.deactivatePicker,
          updateNodePickerPossition = _ref.updateNodePickerPossition,
          nodePickerSelect = _ref.nodePickerSelect;
      return /*#__PURE__*/_react["default"].createElement(_nodePicker.NodePicker, {
        nodePicker: nodePicker,
        onClose: deactivatePicker,
        onMouseMove: updateNodePickerPossition,
        onSelect: function onSelect(target) {
          nodePickerSelect(target);
          selectTab(0); // Switch to the "State" tab.
        }
      });
    }), /*#__PURE__*/_react["default"].createElement(_reactDock["default"], {
      position: "bottom",
      dimMode: "none",
      isVisible: true,
      defaultSize: defaultSize,
      onSizeChange: updateBodyMargin
    }, function () {
      return /*#__PURE__*/_react["default"].createElement(DockContainer, null, /*#__PURE__*/_react["default"].createElement(CloseButton, {
        onClick: toggleDevTools
      }, "\xD7"), /*#__PURE__*/_react["default"].createElement(_unstated.Subscribe, {
        to: [_editor["default"]]
      }, function (_ref2) {
        var nodePicker = _ref2.state.nodePicker,
            deactivatePicker = _ref2.deactivatePicker,
            activatePicker = _ref2.activatePicker;
        return /*#__PURE__*/_react["default"].createElement(_nodePicker.NodePickerTrigger, {
          onClick: nodePicker.active ? deactivatePicker : activatePicker,
          isActive: nodePicker.active
        });
      }), /*#__PURE__*/_react["default"].createElement(_unstated.Subscribe, {
        to: [_editor["default"]]
      }, function (_ref3) {
        var saveSnapshot = _ref3.saveSnapshot;
        return /*#__PURE__*/_react["default"].createElement(_saveSnapshotButton["default"], {
          onClick: saveSnapshot
        }, "Save Snapshot");
      }), /*#__PURE__*/_react["default"].createElement(_tabs.Tabs, {
        onSelect: selectTab,
        selectedIndex: tabIndex
      }, /*#__PURE__*/_react["default"].createElement(_tabs.TabList, null, /*#__PURE__*/_react["default"].createElement(_tabs.Tab, {
        index: "state"
      }, "State"), /*#__PURE__*/_react["default"].createElement(_tabs.Tab, {
        index: "history"
      }, "History"), /*#__PURE__*/_react["default"].createElement(_tabs.Tab, {
        index: "plugins"
      }, "Plugins"), /*#__PURE__*/_react["default"].createElement(_tabs.Tab, {
        index: "schema"
      }, "Schema"), /*#__PURE__*/_react["default"].createElement(_tabs.Tab, {
        index: "structure"
      }, "Structure"), /*#__PURE__*/_react["default"].createElement(_tabs.Tab, {
        index: "snapshots"
      }, "Snapshots")), /*#__PURE__*/_react["default"].createElement(_tabs.TabPanel, null, function (_ref4) {
        var index = _ref4.index;

        switch (index) {
          case "state":
            return /*#__PURE__*/_react["default"].createElement(_state["default"], null);

          case "history":
            return /*#__PURE__*/_react["default"].createElement(_history["default"], null);

          case "plugins":
            return /*#__PURE__*/_react["default"].createElement(_plugins["default"], null);

          case "schema":
            return /*#__PURE__*/_react["default"].createElement(_schema["default"], null);

          case "structure":
            return /*#__PURE__*/_react["default"].createElement(_structure["default"], null);

          case "snapshots":
            return /*#__PURE__*/_react["default"].createElement(_snapshots["default"], null);

          default:
            return /*#__PURE__*/_react["default"].createElement(_state["default"], null);
        }
      })));
    }));
  });
}