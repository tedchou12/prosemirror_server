"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _clamp = _interopRequireDefault(require("./clamp"));

var _rects = require("./rects");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const CLICK_INTERVAL = 350;
const DUMMY_RECT = {
  x: -10000,
  y: -10000,
  w: 0,
  h: 0
};

class PopUpManager {
  constructor() {
    _defineProperty(this, "_bridges", new Map());

    _defineProperty(this, "_positions", new Map());

    _defineProperty(this, "_mx", 0);

    _defineProperty(this, "_my", 0);

    _defineProperty(this, "_rafID", 0);

    _defineProperty(this, "_onScroll", e => {
      this._rafID && cancelAnimationFrame(this._rafID);
      this._rafID = requestAnimationFrame(this._syncPosition);
    });

    _defineProperty(this, "_onResize", e => {
      this._rafID && cancelAnimationFrame(this._rafID);
      this._rafID = requestAnimationFrame(this._syncPosition);
    });

    _defineProperty(this, "_onMouseChange", e => {
      this._mx = Math.round(e.clientX);
      this._my = Math.round(e.clientY);
      this._rafID && cancelAnimationFrame(this._rafID);
      this._rafID = requestAnimationFrame(this._syncPosition);
    });

    _defineProperty(this, "_onClick", e => {
      const now = Date.now();
      let detailsWithModalToDismiss;

      for (const [bridge, registeredAt] of this._bridges) {
        if (now - registeredAt > CLICK_INTERVAL) {
          const details = bridge.getDetails();

          if (details.modal && details.autoDismiss) {
            detailsWithModalToDismiss = details;
          }
        }
      }

      if (!detailsWithModalToDismiss) {
        return;
      }

      const {
        body,
        close
      } = detailsWithModalToDismiss;
      const pointer = (0, _rects.fromXY)(e.clientX, e.clientY, 1);
      const bodyRect = body ? (0, _rects.fromHTMlElement)(body) : null;

      if (!bodyRect || !(0, _rects.isIntersected)(pointer, bodyRect)) {
        close();
      }
    });

    _defineProperty(this, "_syncPosition", () => {
      this._rafID = 0;
      const bridgeToDetails = new Map();

      for (const [bridge, // eslint-disable-next-line no-unused-vars
      registeredAt] of this._bridges) {
        const details = bridge.getDetails();
        bridgeToDetails.set(bridge, details);
        const {
          anchor,
          body
        } = details;

        if (body instanceof HTMLElement) {
          details.bodyRect = (0, _rects.fromHTMlElement)(body);
        }

        if (anchor instanceof HTMLElement) {
          details.anchorRect = (0, _rects.fromHTMlElement)(anchor);
        }
      }

      const pointer = (0, _rects.fromXY)(this._mx, this._my, 2);
      const hoveredAnchors = new Set();

      for (const [bridge, details] of bridgeToDetails) {
        const {
          anchor,
          bodyRect,
          anchorRect,
          position,
          body
        } = details;

        if (!bodyRect && !anchorRect) {
          continue;
        }

        const {
          x,
          y
        } = position(anchorRect, bodyRect);
        const positionKey = `${x}-${y}`;

        if (body && bodyRect && this._positions.get(bridge) !== positionKey) {
          const ax = anchorRect ? (0, _clamp.default)(0, anchorRect.x - x + anchorRect.w / 2, bodyRect.w - anchorRect.w / 2) : 0;

          this._positions.set(bridge, positionKey);

          const bodyStyle = body.style;
          bodyStyle.position = 'absolute';
          bodyStyle.left = `${x}px`;
          bodyStyle.top = `${y}px`;
          bodyStyle.setProperty('--czi-pop-up-anchor-offset-left', `${ax}px`);
          bodyRect.x = x;
          bodyRect.y = y;
        }

        if ((0, _rects.isIntersected)(pointer, bodyRect || DUMMY_RECT, 0) || (0, _rects.isIntersected)(pointer, anchorRect || DUMMY_RECT, 0)) {
          if (anchor) {
            hoveredAnchors.add(anchor);
          }
        }
      }

      while (true) {
        const size = hoveredAnchors.size;

        for (const [// eslint-disable-next-line no-unused-vars
        bridge, details] of bridgeToDetails) {
          const {
            anchor,
            body
          } = details;

          for (const ha of hoveredAnchors) {
            if (anchor && body && !hoveredAnchors.has(anchor) && body.contains(ha)) {
              hoveredAnchors.add(anchor);
            }
          }
        }

        if (hoveredAnchors.size === size) {
          break;
        }
      }

      const now = Date.now();

      for (const [bridge, registeredAt] of this._bridges) {
        const details = bridgeToDetails.get(bridge);

        if (details) {
          const {
            autoDismiss,
            anchor,
            close,
            modal
          } = details;

          if (autoDismiss && // Modal is handled separately at `onClick`
          !modal && now - registeredAt > CLICK_INTERVAL && !hoveredAnchors.has(anchor)) {
            close();
          }
        }
      }
    });
  }

  register(bridge) {
    this._bridges.set(bridge, Date.now());

    this._positions.set(bridge, null);

    if (this._bridges.size === 1) {
      this._observe();
    }

    this._rafID = requestAnimationFrame(this._syncPosition);
  }

  unregister(bridge) {
    this._bridges.delete(bridge);

    this._positions.delete(bridge);

    if (this._bridges.size === 0) {
      this._unobserve();
    }

    this._rafID && cancelAnimationFrame(this._rafID);
  }

  _observe() {
    document.addEventListener('mousemove', this._onMouseChange, false);
    document.addEventListener('mouseup', this._onMouseChange, false);
    document.addEventListener('click', this._onClick, false);
    window.addEventListener('scroll', this._onScroll, true);
    window.addEventListener('resize', this._onResize, true);
  }

  _unobserve() {
    document.removeEventListener('mousemove', this._onMouseChange, false);
    document.removeEventListener('mouseup', this._onMouseChange, false);
    document.removeEventListener('click', this._onClick, false);
    window.removeEventListener('scroll', this._onScroll, true);
    window.removeEventListener('resize', this._onResize, true);
    this._rafID && cancelAnimationFrame(this._rafID);
  }

}

const instance = new PopUpManager();
var _default = instance;
exports.default = _default;