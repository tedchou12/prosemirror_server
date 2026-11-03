"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.itemsCountString = itemsCountString;
exports.getItemString = getItemString;
exports["default"] = JSONDiff;

var _react = _interopRequireDefault(require("react"));

var _jsonTree = _interopRequireDefault(require("./json-tree"));

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _theme = _interopRequireDefault(require("../theme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Updated = (0, _styled["default"])("span")({
  color: _theme["default"].main
});
Updated.displayName = "Updated";
var White = (0, _styled["default"])("span")({
  color: _theme["default"].white
});
White.displayName = "White";
var Deleted = (0, _styled["default"])("span")({
  display: "inline-block",
  background: _theme["default"].lightYellow,
  color: _theme["default"].lightPink,
  padding: "1px 3px 2px",
  textIndent: 0,
  textDecoration: "line-through",
  minHeight: "1ex"
});
Deleted.displayName = "Deleted";
var Added = (0, _styled["default"])("span")({
  display: "inline-block",
  background: _theme["default"].lightYellow,
  color: _theme["default"].darkGreen,
  padding: "1px 3px 2px",
  textIndent: 0,
  minHeight: "1ex"
});
Added.displayName = "Added";

function postprocessValue(value) {
  if (value && value._t === "a") {
    var res = {};

    for (var key in value) {
      if (key !== "_t") {
        if (key[0] === "_" && !value[key.substr(1)]) {
          res[key.substr(1)] = value[key];
        } else if (value["_" + key]) {
          res[key] = [value["_" + key][0], value[key][0]];
        } else if (!value["_" + key] && key[0] !== "_") {
          res[key] = value[key];
        }
      }
    }

    return res;
  }

  return value;
}

function labelRenderer(raw) {
  return raw[0];
}

function stringifyAndShrink(val) {
  if (val === null) {
    return "null";
  }

  var str = JSON.stringify(val);

  if (typeof str === "undefined") {
    return "undefined";
  }

  return str.length > 22 ? "".concat(str.substr(0, 15), "\u2026").concat(str.substr(-5)) : str;
}

function getValueString(raw) {
  if (typeof raw === "string") {
    return raw;
  }

  return stringifyAndShrink(raw);
}

function replaceSpacesWithNonBreakingSpace(value) {
  return value.replace(/\s/gm, " ");
}

function parseTextDiff(textDiff) {
  var diffByLines = textDiff.split(/\n/gm).slice(1);
  return diffByLines.map(function (line) {
    var type = line.startsWith("-") ? "delete" : line.startsWith("+") ? "add" : "raw";
    return _defineProperty({}, type, replaceSpacesWithNonBreakingSpace(line.substr(1)));
  });
}

function valueRenderer(raw) {
  if (Array.isArray(raw)) {
    if (raw.length === 1) {
      return /*#__PURE__*/_react["default"].createElement(Added, null, getValueString(raw[0]));
    }

    if (raw.length === 2) {
      return /*#__PURE__*/_react["default"].createElement(Updated, null, /*#__PURE__*/_react["default"].createElement(Deleted, null, getValueString(raw[0])), " =>", " ", /*#__PURE__*/_react["default"].createElement(Added, null, getValueString(raw[1])));
    }

    if (raw.length === 3 && raw[1] === 0 && raw[2] === 0) {
      return /*#__PURE__*/_react["default"].createElement(Deleted, null, getValueString(raw[0]));
    }

    if (raw.length === 3 && raw[2] === 2) {
      return /*#__PURE__*/_react["default"].createElement(Updated, null, "\"", parseTextDiff(raw[0]).map(function (item) {
        if (item["delete"]) {
          return /*#__PURE__*/_react["default"].createElement(Deleted, {
            key: item["delete"] + "delete"
          }, item["delete"]);
        }

        if (item.add) {
          return /*#__PURE__*/_react["default"].createElement(Added, {
            key: item.add + "add"
          }, item.add);
        }

        return /*#__PURE__*/_react["default"].createElement(White, {
          key: item.raw + "raw"
        }, item.raw);
      }), "\"");
    }
  }

  return "" + raw;
}

function itemsCountString(count) {
  return "".concat(count);
}

function getItemString(type, value, defaultView, keysCount) {
  switch (type) {
    case "Object":
      return /*#__PURE__*/_react["default"].createElement("span", null, "{…}");

    default:
      return /*#__PURE__*/_react["default"].createElement("span", null, defaultView, " ", keysCount);
  }
}

function JSONDiff(props) {
  if (!props.delta) return null;
  return /*#__PURE__*/_react["default"].createElement(_jsonTree["default"], {
    data: props.delta,
    hideRoot: true,
    postprocessValue: postprocessValue,
    labelRenderer: labelRenderer,
    valueRenderer: valueRenderer,
    isCustomNode: Array.isArray,
    getItemString: getItemString,
    shouldExpandNode: function shouldExpandNode() {
      return true;
    }
  });
}