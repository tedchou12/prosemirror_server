"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandedStateFormatSelection = expandedStateFormatSelection;
exports.collapsedStateFormatSelection = collapsedStateFormatSelection;
var copyProps = ["jsonID", "empty", "anchor", "from", "head", "to", "$anchor", "$head", "$cursor", "$to", "$from"];
var copySubProps = {
  $from: ["nodeAfter", "nodeBefore", "parent", "textOffset", "depth", "pos"],
  $to: ["nodeAfter", "nodeBefore", "parent", "textOffset", "depth", "pos"]
};
var isNode = ["nodeAfter", "nodeBefore", "parent"];

function filterProps(selection, props, subProps) {
  return props.reduce(function (acc, prop) {
    if (subProps && subProps[prop]) {
      acc[prop] = subProps[prop].reduce(function (subAcc, subProp) {
        subAcc[subProp] = isNode.indexOf(subProp) === -1 || !selection[prop][subProp] ? selection[prop][subProp] : selection[prop][subProp].toJSON();
        return subAcc;
      }, {});
    } else {
      acc[prop === "jsonID" ? "type" : prop] = selection[prop];
    }

    return acc;
  }, {});
}

function expandedStateFormatSelection(selection) {
  return filterProps(selection, copyProps, copySubProps);
}

function collapsedStateFormatSelection(selection) {
  return filterProps(selection, copyProps.slice(0, 6));
}