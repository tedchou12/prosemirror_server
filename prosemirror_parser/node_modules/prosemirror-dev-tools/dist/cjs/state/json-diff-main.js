"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsonDiffMain = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _jsondiffpatch = require("jsondiffpatch");

var _idleScheduler = require("./idle-scheduler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var JsonDiffMain = /*#__PURE__*/function () {
  function JsonDiffMain() {
    _classCallCheck(this, JsonDiffMain);

    _defineProperty(this, "diffPatcher", new _jsondiffpatch.DiffPatcher({
      arrays: {
        detectMove: false
      },
      textDiff: {
        minLength: 1
      }
    }));

    _defineProperty(this, "scheduler", new _idleScheduler.IdleScheduler());
  }

  _createClass(JsonDiffMain, [{
    key: "diff",
    value: function () {
      var _diff = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee(input) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.scheduler.request();

              case 2:
                return _context.abrupt("return", {
                  id: input.id,
                  delta: this.diffPatcher.diff(input.a, input.b)
                });

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function diff(_x) {
        return _diff.apply(this, arguments);
      }

      return diff;
    }()
  }]);

  return JsonDiffMain;
}();

exports.JsonDiffMain = JsonDiffMain;