"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uuid;

var _uuid = require("uuid");

// [FS] IRAD-1005 2020-07-07
// Upgrade outdated packages.
function uuid() {
  return (0, _uuid.v1)();
}