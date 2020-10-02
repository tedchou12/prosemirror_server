"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IdleScheduler = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var IdleScheduler = /*#__PURE__*/function () {
  function IdleScheduler() {
    _classCallCheck(this, IdleScheduler);

    _defineProperty(this, "task", undefined);
  }

  _createClass(IdleScheduler, [{
    key: "request",
    value: function request() {
      this.cancel();
      var request = window.requestIdleCallback || window.requestAnimationFrame;
      return new Promise(function (resolve) {
        return request(resolve);
      });
    }
  }, {
    key: "cancel",
    value: function cancel() {
      var cancel = window.cancelIdleCallack || window.cancelAnimationFrame;

      if (this.task) {
        cancel(this.task);
      }
    }
  }]);

  return IdleScheduler;
}();

exports.IdleScheduler = IdleScheduler;