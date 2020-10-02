"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEditorKeyMap;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var EditorCommands = _interopRequireWildcard(require("./EditorCommands"));

var EditorKeyMap = _interopRequireWildcard(require("./EditorKeyMap"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const {
  KEY_BACK_DELETE,
  KEY_FORWARD_DELETE,
  // [FS][07-MAY-2020][IRAD-956]
  // KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE,
  KEY_INSERT_NEW_LINE_IN_LIST_ITEM,
  KEY_REDO,
  KEY_SPLIT_LIST_ITEM,
  KEY_TAB_SHIFT,
  KEY_TAB,
  KEY_TOGGLE_BOLD,
  KEY_TOGGLE_ITALIC,
  KEY_UNDO
} = EditorKeyMap;
const {
  // [FS][07-MAY-2020][IRAD-956]
  // BLOCKQUOTE_INSERT_NEW_LINE,
  EM,
  HISTORY_REDO,
  HISTORY_UNDO,
  INDENT_LESS,
  INDENT_MORE,
  LIST_ITEM_INSERT_NEW_LINE,
  LIST_ITEM_MERGE_DOWN,
  LIST_ITEM_MERGE_UP,
  LIST_SPLIT,
  TABLE_MOVE_TO_NEXT_CELL,
  TABLE_MOVE_TO_PREV_CELL,
  TEXT_INSERT_TAB_SPACE,
  STRONG
} = EditorCommands;

function bindCommands(...commands) {
  return function (state, dispatch, view) {
    return commands.some(cmd => {
      if (cmd.isEnabled(state, view)) {
        cmd.execute(state, dispatch, view);
        return true;
      }

      return false;
    });
  };
}

function createEditorKeyMap() {
  const result = {
    [KEY_BACK_DELETE.common]: LIST_ITEM_MERGE_UP.execute,
    [KEY_FORWARD_DELETE.common]: LIST_ITEM_MERGE_DOWN.execute,
    [KEY_REDO.common]: HISTORY_REDO.execute,
    [KEY_SPLIT_LIST_ITEM.common]: LIST_SPLIT.execute,
    [KEY_TAB.common]: bindCommands(TABLE_MOVE_TO_NEXT_CELL, TEXT_INSERT_TAB_SPACE, INDENT_MORE),
    [KEY_TAB_SHIFT.common]: bindCommands(TABLE_MOVE_TO_PREV_CELL, TEXT_INSERT_TAB_SPACE, INDENT_LESS),
    [KEY_TOGGLE_BOLD.common]: STRONG.execute,
    [KEY_TOGGLE_ITALIC.common]: EM.execute,
    [KEY_UNDO.common]: HISTORY_UNDO.execute,
    // [FS][07-MAY-2020][IRAD-956]
    // [KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE.common]:
    //   BLOCKQUOTE_INSERT_NEW_LINE.execute,
    [KEY_INSERT_NEW_LINE_IN_LIST_ITEM.common]: LIST_ITEM_INSERT_NEW_LINE.execute
  };
  return result;
}