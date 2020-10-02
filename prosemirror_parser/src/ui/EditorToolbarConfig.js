// @flow

// eslint-disable-next-line no-unused-vars
import * as React from 'react';

import * as EditorCommands from '../EditorCommands';
import FontSizeCommandMenuButton from './FontSizeCommandMenuButton';
import FontTypeCommandMenuButton from './FontTypeCommandMenuButton';
import HeadingCommandMenuButton from './HeadingCommandMenuButton';
import Icon from './Icon';
import Lang from './i18n';

const ICON_LABEL_PATTERN = /\[([A-Za-z_\d]+)\](.*)/;

export function parseLabel(input: string): Object {
  const matched = input.match(ICON_LABEL_PATTERN);
  if (matched) {
    const [
      // eslint-disable-next-line no-unused-vars
      all,
      icon,
      label,
    ] = matched;
    return {
      icon: icon ? Icon.get(icon) : null,
      title: label || null,
    };
  }
  return {
    icon: null,
    title: input || null,
  };
}

const {
  // [FS][07-MAY-2020][IRAD-956]
  // BLOCKQUOTE_TOGGLE,
  CLEAR_FORMAT,
  DOC_LAYOUT,
  EM,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  HISTORY_REDO,
  HISTORY_UNDO,
  HR,
  IMAGE_FROM_URL,
  IMAGE_UPLOAD,
  INDENT_LESS,
  INDENT_MORE,
  LINK_SET_URL,
  MATH_EDIT,
  OL,
  STRIKE,
  STRONG,
  SUPER,
  SUB,
  TABLE_ADD_COLUMN_AFTER,
  TABLE_ADD_COLUMN_BEFORE,
  TABLE_ADD_ROW_AFTER,
  TABLE_ADD_ROW_BEFORE,
  TABLE_BORDER_COLOR,
  TABLE_BACKGROUND_COLOR,
  TABLE_DELETE_COLUMN,
  TABLE_DELETE_ROW,
  TABLE_DELETE_TABLE,
  TABLE_INSERT_TABLE,
  TABLE_MERGE_CELLS,
  // TABLE_MOVE_TO_NEXT_CELL,
  // TABLE_MOVE_TO_PREV_CELL,
  TABLE_SPLIT_ROW,
  TABLE_TOGGLE_HEADER_CELL,
  TABLE_TOGGLE_HEADER_COLUMN,
  TABLE_TOGGLE_HEADER_ROW,
  TEXT_ALIGN_CENTER,
  TEXT_ALIGN_JUSTIFY,
  TEXT_ALIGN_LEFT,
  TEXT_ALIGN_RIGHT,
  TEXT_COLOR,
  TEXT_HIGHLIGHT,
  TEXT_LINE_SPACINGS,
  UL,
  UNDERLINE,
} = EditorCommands;

export const TABLE_COMMANDS_GROUP = [
  {
    [Lang('Insert Table...')]: TABLE_INSERT_TABLE,
  },
  {
    [Lang('Fill Color...')]: TABLE_BACKGROUND_COLOR,
    [Lang('Border Color....')]: TABLE_BORDER_COLOR,
  },
  {
    [Lang('Insert Column Before')]: TABLE_ADD_COLUMN_BEFORE,
    [Lang('Insert Column After')]: TABLE_ADD_COLUMN_AFTER,
    [Lang('Delete Column')]: TABLE_DELETE_COLUMN,
  },
  {
    [Lang('Insert Row Before')]: TABLE_ADD_ROW_BEFORE,
    [Lang('Insert Row After')]: TABLE_ADD_ROW_AFTER,
    [Lang('Delete Row')]: TABLE_DELETE_ROW,
  },
  {
    [Lang('Merge Cells')]: TABLE_MERGE_CELLS,
    [Lang('Split Row')]: TABLE_SPLIT_ROW,
  },
  // Disable these commands cause user rarely use them.
  {
    [Lang('Toggle Header Column')]: TABLE_TOGGLE_HEADER_COLUMN,
    [Lang('Toggle Header Row')]: TABLE_TOGGLE_HEADER_ROW,
    [Lang('Toggle Header Cells')]: TABLE_TOGGLE_HEADER_CELL,
  },
  {
    [Lang('Delete Table')]: TABLE_DELETE_TABLE,
  },
];


// [FS] IRAD-1012 2020-07-14
// Fix: Toolbar is poorly organized.

export const COMMAND_GROUPS = [
  {
    [Lang('[font_download] Font Type')]: FontTypeCommandMenuButton,
  },
  {
    [Lang('[format_size] Text Size')]: FontSizeCommandMenuButton,
  },
  {
    [Lang('[format_bold] Bold')]: STRONG,
    [Lang('[format_italic] Italic')]: EM,
    [Lang('[format_underline] Underline')]: UNDERLINE,
    [Lang('[format_strikethrough] Strike through')]: STRIKE,
    [Lang('[superscript] Superscript')]: SUPER,
    [Lang('[subscript] Subscript')]: SUB,
    [Lang('[format_color_text] Text color')]: TEXT_COLOR,
    [Lang('[border_color] Highlight color')]: TEXT_HIGHLIGHT,
    [Lang('[format_clear] Clear formats')]: CLEAR_FORMAT,
  },
  {
    [Lang('[format_align_left] Left align')]: TEXT_ALIGN_LEFT,
    [Lang('[format_align_center] Center Align')]: TEXT_ALIGN_CENTER,
    [Lang('[format_align_right] Right Align')]: TEXT_ALIGN_RIGHT,
    [Lang('[format_align_justify] Justify')]: TEXT_ALIGN_JUSTIFY,
  },
  {
    [Lang('[format_indent_increase] Indent more')]: INDENT_MORE,
    [Lang('[format_indent_decrease] Indent less')]: INDENT_LESS,
    [Lang('[format_line_spacing] Line spacing')]: TEXT_LINE_SPACINGS,
  },
  {
    [Lang('[format_list_numbered] Ordered list')]: OL,
    [Lang('[format_list_bulleted] Bulleted list')]: UL,
  },
  // [FS] IRAD-1042 2020-09-09
  // Changes the menu for include the custom styles.
  {
    [Lang('[H1] Header 1')]: HeadingCommandMenuButton,
  },
  {
    [Lang('[link] Apply link')]: LINK_SET_URL,
    [Lang('[image] Insert image')]: [
      {
        [Lang('Insert image by URL')]: IMAGE_FROM_URL,
        [Lang('Upload image from computer')]: IMAGE_UPLOAD,
      },
    ],
    [Lang('[grid_on] Table...')]: TABLE_COMMANDS_GROUP,
    [Lang('[hr] Horizontal line')]: HR,
    [Lang('[functions] Math')]: MATH_EDIT,

    // [FS][07-MAY-2020][IRAD-956]
    // '[format_quote] Block quote': BLOCKQUOTE_TOGGLE,
  },
  {
    [Lang('[settings_overscan] Page layout')]: DOC_LAYOUT,
  },
  {
    [Lang('[undo] Undo')]: HISTORY_UNDO,
    [Lang('[redo] Redo')]: HISTORY_REDO,
  },

];
