"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showCursorPlaceholder = showCursorPlaceholder;
exports.hideCursorPlaceholder = hideCursorPlaceholder;
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

const PLACE_HOLDER_ID = {
  name: 'CursorPlaceholderPlugin'
};
let singletonInstance = null; // https://prosemirror.net/examples/upload/

const SPEC = {
  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  key: new _prosemirrorState.PluginKey('CursorPlaceholderPlugin'),
  state: {
    init() {
      return _prosemirrorView.DecorationSet.empty;
    },

    apply(tr, set) {
      set = set.map(tr.mapping, tr.doc);
      const action = tr.getMeta(this);

      if (!action) {
        return set;
      }

      if (action.add) {
        const widget = document.createElement('czi-cursor-placeholder');
        widget.className = 'czi-cursor-placeholder';

        const deco = _prosemirrorView.Decoration.widget(action.add.pos, widget, {
          id: PLACE_HOLDER_ID
        });

        set = set.add(tr.doc, [deco]);
      } else if (action.remove) {
        const found = set.find(null, null, specFinder);
        set = set.remove(found);
      }

      return set;
    }

  },
  props: {
    decorations: state => {
      const plugin = singletonInstance;
      return plugin ? plugin.getState(state) : null;
    }
  }
};

class CursorPlaceholderPlugin extends _prosemirrorState.Plugin {
  constructor() {
    super(SPEC);

    if (singletonInstance) {
      return singletonInstance;
    }

    singletonInstance = this;
  }

}

function specFinder(spec) {
  return spec.id === PLACE_HOLDER_ID;
}

function findCursorPlaceholderPos(state) {
  if (!singletonInstance) {
    return null;
  }

  const decos = singletonInstance.getState(state);
  const found = decos.find(null, null, specFinder);
  const pos = found.length ? found[0].from : null;
  return pos || null;
}

function showCursorPlaceholder(state) {
  const plugin = singletonInstance;
  let {
    tr
  } = state;

  if (!plugin || !tr.selection) {
    return tr;
  }

  const pos = findCursorPlaceholderPos(state);

  if (pos === null) {
    if (!tr.selection.empty) {
      // Replace the selection with a placeholder.
      tr = tr.deleteSelection();
    }

    tr = tr.setMeta(plugin, {
      add: {
        pos: tr.selection.from
      }
    });
  }

  return tr;
}

function hideCursorPlaceholder(state) {
  const plugin = singletonInstance;
  let {
    tr
  } = state;

  if (!plugin) {
    return tr;
  }

  const pos = findCursorPlaceholderPos(state);

  if (pos !== null) {
    tr = tr.setMeta(plugin, {
      remove: {}
    });
  }

  return tr;
}

var _default = CursorPlaceholderPlugin;
exports.default = _default;