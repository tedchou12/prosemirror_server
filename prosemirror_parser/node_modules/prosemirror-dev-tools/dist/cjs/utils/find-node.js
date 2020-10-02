"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = findNodeIn;
exports.findNodeInJSON = findNodeInJSON;

function findNode(fullPath, currentNode, nodeToFind) {
  if (nodeToFind === currentNode) {
    return fullPath;
  }

  if (!currentNode.content || !currentNode.content.content) return null;
  var res = currentNode.content.content.map(function (currentNode, i) {
    return findNode([].concat(fullPath, "content", i), currentNode, nodeToFind);
  }).filter(function (res) {
    return Array.isArray(res) && res.length;
  })[0];
  return res;
}

function findNodeIn(doc, node) {
  var path = findNode([], doc, node);

  if (path) {
    return path.reduce(function (newPath, item) {
      // [0, content, content, 0] => [0, content, 0]
      // Because JSON representation a bit different from actual DOC.
      if (item === "content" && newPath[newPath.length - 1] === "content") {
        return newPath;
      }

      newPath.push(item);
      return newPath;
    }, []);
  }
}

function findNodeJSON(fullPath, currentNode, nodeToFind) {
  if (nodeToFind === currentNode) {
    return fullPath;
  }

  if (!currentNode.content) return null;

  if (currentNode.content === nodeToFind) {
    return fullPath.concat("content");
  }

  var res = currentNode.content.map(function (currentNode, i) {
    return findNodeJSON([].concat(fullPath, "content", i), currentNode, nodeToFind);
  }).filter(function (res) {
    return Array.isArray(res) && res.length;
  })[0];
  return res;
}

function findNodeInJSON(doc, node) {
  var path = findNodeJSON([], doc, node);

  if (path) {
    return path.reduce(function (newPath, item) {
      newPath.push(item);

      if (item === "content") {
        newPath.push("content");
      }

      return newPath;
    }, []);
  }
}