"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tooltip = tooltip;
exports.findKeymapByDescription = findKeymapByDescription;
exports.findShortcutByDescription = findShortcutByDescription;
exports.findShortcutByKeymap = findShortcutByKeymap;
exports.ALL_KEYS = exports.KEY_UNDO = exports.KEY_TOGGLE_UNDERLINE = exports.KEY_TOGGLE_STRIKETHROUGH = exports.KEY_TOGGLE_ORDERED_LIST = exports.KEY_TOGGLE_MONOSPACE = exports.KEY_TOGGLE_ITALIC = exports.KEY_TOGGLE_HEADING_6 = exports.KEY_TOGGLE_HEADING_5 = exports.KEY_TOGGLE_HEADING_4 = exports.KEY_TOGGLE_HEADING_3 = exports.KEY_TOGGLE_HEADING_2 = exports.KEY_TOGGLE_HEADING_1 = exports.KEY_TOGGLE_CODE_BLOCK = exports.KEY_TOGGLE_BULLET_LIST = exports.KEY_TOGGLE_BOLD = exports.KEY_TOGGLE_BLOCK_QUOTE = exports.KEY_TAB_SHIFT = exports.KEY_TAB = exports.KEY_SPLIT_LIST_ITEM = exports.KEY_SPLIT_CODEBLOCK = exports.KEY_SHIFT_BACKSPACE = exports.KEY_SET_NORMAL_TEXT = exports.KEY_REDO = exports.KEY_INSERT_NEW_LINE_IN_LIST_ITEM = exports.KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE = exports.KEY_INSERT_NEW_LINE = exports.KEY_INSERT_HORIZONTAL_RULE = exports.KEY_FORWARD_DELETE = exports.KEY_BACK_DELETE = void 0;

var _browserkeymap = _interopRequireDefault(require("browserkeymap"));

var _browser = _interopRequireDefault(require("./browser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://tinyurl.com/ybwf3wex
function tooltip(keymap) {
  if (keymap) {
    let shortcut;

    if (_browser.default.isMac()) {
      shortcut = keymap.mac.replace(/Cmd/i, '⌘').replace(/Shift/i, '⇧').replace(/Ctrl/i, '^').replace(/Alt/i, '⌥');
    } else {
      shortcut = keymap.windows;
    }

    return `${keymap.description} (${shortcut})`;
  }

  return null;
}

function findKeymapByDescription(description) {
  const matches = ALL_KEYS.filter(keymap => {
    return keymap.description.toUpperCase() === description.toUpperCase();
  });
  return matches[0];
}

function findShortcutByDescription(description) {
  const keymap = findKeymapByDescription(description);

  if (keymap) {
    return findShortcutByKeymap(keymap);
  }

  return null;
}

function findShortcutByKeymap(keymap) {
  if (_browser.default.isMac()) {
    return keymap.mac;
  }

  return keymap.windows;
}

function makeKeyMap(description, windows, mac, common) {
  return {
    description: description,
    windows: windows,
    mac: mac,
    common: common
  };
}

function makeKeyMapWithCommon(description, common) {
  const windows = common.replace(/Mod/i, 'Ctrl');
  const mac = common.replace(/Mod/i, 'Cmd');
  return makeKeyMap(description, windows, mac, common);
}

const KEY_BACK_DELETE = makeKeyMapWithCommon('', 'Backspace');
exports.KEY_BACK_DELETE = KEY_BACK_DELETE;
const KEY_FORWARD_DELETE = makeKeyMapWithCommon('', 'Delete');
exports.KEY_FORWARD_DELETE = KEY_FORWARD_DELETE;
const KEY_INSERT_HORIZONTAL_RULE = makeKeyMapWithCommon('Insert horizontal rule', 'Mod-Shift--');
exports.KEY_INSERT_HORIZONTAL_RULE = KEY_INSERT_HORIZONTAL_RULE;
const KEY_INSERT_NEW_LINE = makeKeyMapWithCommon('Insert new line', 'Shift-Enter');
exports.KEY_INSERT_NEW_LINE = KEY_INSERT_NEW_LINE;
const KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE = makeKeyMapWithCommon('Insert new line in blockquote', 'Shift-Enter');
exports.KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE = KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE;
const KEY_INSERT_NEW_LINE_IN_LIST_ITEM = makeKeyMapWithCommon('Insert new line in list item', 'Shift-Enter');
exports.KEY_INSERT_NEW_LINE_IN_LIST_ITEM = KEY_INSERT_NEW_LINE_IN_LIST_ITEM;
const KEY_REDO = makeKeyMapWithCommon('Redo', 'Mod-Shift-z');
exports.KEY_REDO = KEY_REDO;
const KEY_SET_NORMAL_TEXT = makeKeyMap('Normal text', 'Ctrl-0', 'Cmd-Alt-0');
exports.KEY_SET_NORMAL_TEXT = KEY_SET_NORMAL_TEXT;
const KEY_SHIFT_BACKSPACE = makeKeyMapWithCommon('Shift Backspace', 'Shift-Backspace');
exports.KEY_SHIFT_BACKSPACE = KEY_SHIFT_BACKSPACE;
const KEY_SPLIT_CODEBLOCK = makeKeyMapWithCommon('Split code block', 'Enter');
exports.KEY_SPLIT_CODEBLOCK = KEY_SPLIT_CODEBLOCK;
const KEY_SPLIT_LIST_ITEM = makeKeyMapWithCommon('Split list item', 'Enter');
exports.KEY_SPLIT_LIST_ITEM = KEY_SPLIT_LIST_ITEM;
const KEY_TAB = makeKeyMapWithCommon('', 'Tab');
exports.KEY_TAB = KEY_TAB;
const KEY_TAB_SHIFT = makeKeyMapWithCommon('', 'Shift-Tab');
exports.KEY_TAB_SHIFT = KEY_TAB_SHIFT;
const KEY_TOGGLE_BLOCK_QUOTE = makeKeyMap('Block quote', 'Ctrl-7', 'Cmd-Alt-7');
exports.KEY_TOGGLE_BLOCK_QUOTE = KEY_TOGGLE_BLOCK_QUOTE;
const KEY_TOGGLE_BOLD = makeKeyMapWithCommon('Toggle bold', 'Mod-b');
exports.KEY_TOGGLE_BOLD = KEY_TOGGLE_BOLD;
const KEY_TOGGLE_BULLET_LIST = makeKeyMapWithCommon('Toggle bullet list', 'Mod-Shift-b');
exports.KEY_TOGGLE_BULLET_LIST = KEY_TOGGLE_BULLET_LIST;
const KEY_TOGGLE_CODE_BLOCK = makeKeyMap('Code block', 'Ctrl-8', 'Cmd-Alt-8');
exports.KEY_TOGGLE_CODE_BLOCK = KEY_TOGGLE_CODE_BLOCK;
const KEY_TOGGLE_HEADING_1 = makeKeyMap('Heading 1', 'Ctrl-1', 'Cmd-Alt-1');
exports.KEY_TOGGLE_HEADING_1 = KEY_TOGGLE_HEADING_1;
const KEY_TOGGLE_HEADING_2 = makeKeyMap('Heading 2', 'Ctrl-2', 'Cmd-Alt-2');
exports.KEY_TOGGLE_HEADING_2 = KEY_TOGGLE_HEADING_2;
const KEY_TOGGLE_HEADING_3 = makeKeyMap('Heading 3', 'Ctrl-3', 'Cmd-Alt-3');
exports.KEY_TOGGLE_HEADING_3 = KEY_TOGGLE_HEADING_3;
const KEY_TOGGLE_HEADING_4 = makeKeyMap('Heading 4', 'Ctrl-4', 'Cmd-Alt-4');
exports.KEY_TOGGLE_HEADING_4 = KEY_TOGGLE_HEADING_4;
const KEY_TOGGLE_HEADING_5 = makeKeyMap('Heading 5', 'Ctrl-5', 'Cmd-Alt-5');
exports.KEY_TOGGLE_HEADING_5 = KEY_TOGGLE_HEADING_5;
const KEY_TOGGLE_HEADING_6 = makeKeyMap('Heading 5', 'Ctrl-6', 'Cmd-Alt-6');
exports.KEY_TOGGLE_HEADING_6 = KEY_TOGGLE_HEADING_6;
const KEY_TOGGLE_ITALIC = makeKeyMapWithCommon('Toggle italic', 'Mod-i');
exports.KEY_TOGGLE_ITALIC = KEY_TOGGLE_ITALIC;
const KEY_TOGGLE_MONOSPACE = makeKeyMapWithCommon('Toggle monospace', 'Mod-Shift-m');
exports.KEY_TOGGLE_MONOSPACE = KEY_TOGGLE_MONOSPACE;
const KEY_TOGGLE_ORDERED_LIST = makeKeyMapWithCommon('Toggle ordered list', 'Mod-Shift-l');
exports.KEY_TOGGLE_ORDERED_LIST = KEY_TOGGLE_ORDERED_LIST;
const KEY_TOGGLE_STRIKETHROUGH = makeKeyMapWithCommon('Toggle strikethrough', 'Mod-Shift-s');
exports.KEY_TOGGLE_STRIKETHROUGH = KEY_TOGGLE_STRIKETHROUGH;
const KEY_TOGGLE_UNDERLINE = makeKeyMapWithCommon('Toggle underline', 'Mod-u');
exports.KEY_TOGGLE_UNDERLINE = KEY_TOGGLE_UNDERLINE;
const KEY_UNDO = makeKeyMapWithCommon('Undo', 'Mod-z');
exports.KEY_UNDO = KEY_UNDO;
const ALL_KEYS = [KEY_BACK_DELETE, KEY_FORWARD_DELETE, KEY_INSERT_HORIZONTAL_RULE, KEY_INSERT_NEW_LINE, KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE, KEY_INSERT_NEW_LINE_IN_LIST_ITEM, KEY_SET_NORMAL_TEXT, KEY_SHIFT_BACKSPACE, KEY_SPLIT_LIST_ITEM, KEY_TAB_SHIFT, KEY_TAB, KEY_TOGGLE_BLOCK_QUOTE, KEY_TOGGLE_BOLD, KEY_TOGGLE_BULLET_LIST, KEY_TOGGLE_BULLET_LIST, KEY_TOGGLE_CODE_BLOCK, KEY_TOGGLE_HEADING_1, KEY_TOGGLE_HEADING_2, KEY_TOGGLE_HEADING_3, KEY_TOGGLE_HEADING_4, KEY_TOGGLE_HEADING_5, KEY_TOGGLE_HEADING_6, KEY_TOGGLE_ITALIC, KEY_TOGGLE_MONOSPACE, KEY_TOGGLE_ORDERED_LIST, KEY_TOGGLE_STRIKETHROUGH, KEY_TOGGLE_UNDERLINE, KEY_UNDO];
exports.ALL_KEYS = ALL_KEYS;