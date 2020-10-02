"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadImageFiles = uploadImageFiles;
exports.default = void 0;

var _nullthrows = _interopRequireDefault(require("nullthrows"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _NodeNames = require("./NodeNames");

var _uuid = _interopRequireDefault(require("./ui/uuid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const IMAGE_FILE_TYLES = new Set(['image/jpeg', 'image/gif', 'image/png', 'image/jpg']);
const TITLE = 'Uploading...';
const INNER_HTML = new Array(4).join('<div class="czi-image-upload-placeholder-child"></div>');

function isImageUploadPlaceholderPlugin(plugin) {
  return plugin instanceof ImageUploadPlaceholderPlugin;
}

function isImageFileType(file) {
  return file && IMAGE_FILE_TYLES.has(file.type);
}

function findImageUploadPlaceholder(placeholderPlugin, state, id) {
  const decos = placeholderPlugin.getState(state);
  const found = decos.find(null, null, spec => spec.id === id);
  return found.length ? found[0].from : null;
}

function defer(fn) {
  return () => {
    setTimeout(fn, 0);
  };
}

function uploadImageFiles(view, files, coords) {
  const {
    runtime,
    state,
    readOnly,
    disabled
  } = view;
  const {
    schema,
    plugins
  } = state;

  if (readOnly || disabled || !runtime || !runtime.canUploadImage) {
    return false;
  }

  const imageType = schema.nodes[_NodeNames.IMAGE];

  if (!imageType) {
    return false;
  }

  const {
    uploadImage,
    canUploadImage
  } = runtime;

  if (!uploadImage || !canUploadImage) {
    return false;
  }

  const imageFiles = Array.from(files).filter(isImageFileType);

  if (!imageFiles.length) {
    return false;
  }

  const placeholderPlugin = plugins.find(isImageUploadPlaceholderPlugin);

  if (!placeholderPlugin) {
    return false;
  } // A fresh object to act as the ID for this upload.


  const id = {
    debugId: 'image_upload_' + (0, _uuid.default)()
  };
  const uploadNext = defer(() => {
    const done = imageInfo => {
      const pos = findImageUploadPlaceholder(placeholderPlugin, view.state, id);
      let trNext = view.state.tr;

      if (pos && !view.readOnly && !view.disabled) {
        const imageNode = imageType.create(imageInfo);
        trNext = trNext.replaceWith(pos, pos, imageNode);
      } else {
        // Upload was cancelled.
        imageFiles.length = 0;
      }

      if (imageFiles.length) {
        uploadNext();
      } else {
        // Remove the placeholder.
        trNext = trNext.setMeta(placeholderPlugin, {
          remove: {
            id
          }
        });
      }

      view.dispatch(trNext);
    };

    const ff = (0, _nullthrows.default)(imageFiles.shift());
    uploadImage(ff).then(done).catch(done.bind(null, {
      src: null
    }));
  });
  uploadNext();
  let {
    tr
  } = state; // Replace the selection with a placeholder

  let from = 0; // Adjust the cursor to the dropped position.

  if (coords) {
    const dropPos = view.posAtCoords({
      left: coords.x,
      top: coords.y
    });

    if (!dropPos) {
      return false;
    }

    from = dropPos.pos;
    tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, from, from));
  } else {
    from = tr.selection.to;
    tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, from, from));
  }

  const meta = {
    add: {
      id,
      pos: from
    }
  };
  tr = tr.setMeta(placeholderPlugin, meta);
  view.dispatch(tr);
  return true;
} // https://prosemirror.net/examples/upload/


class ImageUploadPlaceholderPlugin extends _prosemirrorState.Plugin {
  constructor() {
    super({
      // [FS] IRAD-1005 2020-07-07
      // Upgrade outdated packages.    
      key: new _prosemirrorState.PluginKey('ImageUploadPlaceholderPlugin'),
      state: {
        init() {
          return _prosemirrorView.DecorationSet.empty;
        },

        apply(tr, set) {
          // Adjust decoration positions to changes made by the transaction
          set = set.map(tr.mapping, tr.doc); // See if the transaction adds or removes any placeholders

          const action = tr.getMeta(this);

          if (action && action.add) {
            const el = document.createElement('div');
            el.title = TITLE;
            el.className = 'czi-image-upload-placeholder';
            el.innerHTML = INNER_HTML;

            const deco = _prosemirrorView.Decoration.widget(action.add.pos, el, {
              id: action.add.id
            });

            set = set.add(tr.doc, [deco]);
          } else if (action && action.remove) {
            const finder = spec => spec.id == action.remove.id;

            set = set.remove(set.find(null, null, finder));
          }

          return set;
        }

      },
      props: {
        decorations(state) {
          return this.getState(state);
        }

      }
    });
  }

}

var _default = ImageUploadPlaceholderPlugin;
exports.default = _default;