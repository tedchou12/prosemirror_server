"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const EventType = {
  CLICK: 'mouseup',
  MOUSEENTER: 'mouseenter'
};

function dryRunEditorStateProxyGetter(state, propKey) {
  const val = state[propKey];

  if (propKey === 'tr' && val instanceof _prosemirrorTransform.Transform) {
    return val.setMeta('dryrun', true);
  }

  return val;
}

function dryRunEditorStateProxySetter(state, propKey, propValue) {
  state[propKey] = propValue; // Indicate success

  return true;
}

class UICommand {
  constructor() {
    _defineProperty(this, "shouldRespondToUIEvent", e => {
      return e.type === UICommand.EventType.CLICK;
    });

    _defineProperty(this, "renderLabel", state => {
      return null;
    });

    _defineProperty(this, "isActive", state => {
      return false;
    });

    _defineProperty(this, "isEnabled", (state, view) => {
      return this.dryRun(state, view);
    });

    _defineProperty(this, "dryRun", (state, view) => {
      const {
        Proxy
      } = window;
      const dryRunState = Proxy ? new Proxy(state, {
        get: dryRunEditorStateProxyGetter,
        set: dryRunEditorStateProxySetter
      }) : state;
      return this.execute(dryRunState, null, view);
    });

    _defineProperty(this, "execute", (state, dispatch, view, event) => {
      this.waitForUserInput(state, dispatch, view, event).then(inputs => {
        this.executeWithUserInput(state, dispatch, view, inputs);
      }).catch(error => {
        console.error(error);
      });
      return false;
    });

    _defineProperty(this, "waitForUserInput", (state, dispatch, view, event) => {
      return Promise.resolve(undefined);
    });

    _defineProperty(this, "executeWithUserInput", (state, dispatch, view, inputs) => {
      return false;
    });
  }

  cancel() {// subclass should overwrite this.
  }

}

_defineProperty(UICommand, "EventType", EventType);

var _default = UICommand;
exports.default = _default;