import _regeneratorRuntime from "@babel/runtime/regenerator";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import nanoid from "nanoid";
import { IdleScheduler } from "./idle-scheduler";
export var JsonDiffWorker = /*#__PURE__*/function () {
  function JsonDiffWorker(worker) {
    var _this = this;

    _classCallCheck(this, JsonDiffWorker);

    _defineProperty(this, "queue", new Map());

    _defineProperty(this, "scheduler", new IdleScheduler());

    this.worker = worker;
    this.worker.addEventListener("message", function (e) {
      var deferred = _this.queue.get(e.data.id);

      if (deferred) {
        _this.queue["delete"](e.data.id);

        deferred.resolve(e.data.returns);
      }
    });
  }

  _createClass(JsonDiffWorker, [{
    key: "diff",
    value: function () {
      var _diff = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(input) {
        var id, deferred;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.scheduler.request();

              case 2:
                id = nanoid();
                deferred = createDeferrable();
                this.queue.set(id, deferred);
                this.worker.postMessage({
                  method: "diff",
                  id: id,
                  args: [input]
                });
                return _context.abrupt("return", deferred);

              case 7:
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

  return JsonDiffWorker;
}();

function createDeferrable() {
  var r;
  var p = new Promise(function (resolve) {
    r = resolve;
  });

  p.resolve = function () {
    return r.apply(void 0, arguments);
  };

  return p;
}