function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
import JSONTree from "./json-tree";
import styled from "@emotion/styled";
import theme from "../theme";
var Updated = styled("span")({
  color: theme.main
});
Updated.displayName = "Updated";
var White = styled("span")({
  color: theme.white
});
White.displayName = "White";
var Deleted = styled("span")({
  display: "inline-block",
  background: theme.lightYellow,
  color: theme.lightPink,
  padding: "1px 3px 2px",
  textIndent: 0,
  textDecoration: "line-through",
  minHeight: "1ex"
});
Deleted.displayName = "Deleted";
var Added = styled("span")({
  display: "inline-block",
  background: theme.lightYellow,
  color: theme.darkGreen,
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
      return /*#__PURE__*/React.createElement(Added, null, getValueString(raw[0]));
    }

    if (raw.length === 2) {
      return /*#__PURE__*/React.createElement(Updated, null, /*#__PURE__*/React.createElement(Deleted, null, getValueString(raw[0])), " =>", " ", /*#__PURE__*/React.createElement(Added, null, getValueString(raw[1])));
    }

    if (raw.length === 3 && raw[1] === 0 && raw[2] === 0) {
      return /*#__PURE__*/React.createElement(Deleted, null, getValueString(raw[0]));
    }

    if (raw.length === 3 && raw[2] === 2) {
      return /*#__PURE__*/React.createElement(Updated, null, "\"", parseTextDiff(raw[0]).map(function (item) {
        if (item["delete"]) {
          return /*#__PURE__*/React.createElement(Deleted, {
            key: item["delete"] + "delete"
          }, item["delete"]);
        }

        if (item.add) {
          return /*#__PURE__*/React.createElement(Added, {
            key: item.add + "add"
          }, item.add);
        }

        return /*#__PURE__*/React.createElement(White, {
          key: item.raw + "raw"
        }, item.raw);
      }), "\"");
    }
  }

  return "" + raw;
}

export function itemsCountString(count) {
  return "".concat(count);
}
export function getItemString(type, value, defaultView, keysCount) {
  switch (type) {
    case "Object":
      return /*#__PURE__*/React.createElement("span", null, "{…}");

    default:
      return /*#__PURE__*/React.createElement("span", null, defaultView, " ", keysCount);
  }
}
export default function JSONDiff(props) {
  if (!props.delta) return null;
  return /*#__PURE__*/React.createElement(JSONTree, {
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