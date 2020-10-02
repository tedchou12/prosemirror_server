"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNDERLINE = exports.UL = exports.TEXT_LINE_SPACINGS = exports.TEXT_INSERT_TAB_SPACE = exports.TEXT_HIGHLIGHT = exports.TEXT_COLOR = exports.TEXT_ALIGN_RIGHT = exports.TEXT_ALIGN_LEFT = exports.TEXT_ALIGN_JUSTIFY = exports.TEXT_ALIGN_CENTER = exports.TABLE_TOGGLE_HEADER_ROW = exports.TABLE_TOGGLE_HEADER_COLUMN = exports.TABLE_TOGGLE_HEADER_CELL = exports.TABLE_SPLIT_ROW = exports.TABLE_MOVE_TO_PREV_CELL = exports.TABLE_MOVE_TO_NEXT_CELL = exports.TABLE_MERGE_CELLS = exports.TABLE_INSERT_TABLE = exports.TABLE_DELETE_TABLE = exports.TABLE_DELETE_ROW = exports.TABLE_DELETE_COLUMN = exports.TABLE_BORDER_COLOR = exports.TABLE_BACKGROUND_COLOR = exports.TABLE_ADD_ROW_BEFORE = exports.TABLE_ADD_ROW_AFTER = exports.TABLE_ADD_COLUMN_BEFORE = exports.TABLE_ADD_COLUMN_AFTER = exports.SUB = exports.SUPER = exports.STRONG = exports.STRIKE = exports.PRINT = exports.OL = exports.MATH_EDIT = exports.LIST_SPLIT = exports.LIST_ITEM_MERGE_UP = exports.LIST_ITEM_MERGE_DOWN = exports.LIST_ITEM_INSERT_NEW_LINE = exports.LINK_SET_URL = exports.INDENT_MORE = exports.INDENT_LESS = exports.IMAGE_UPLOAD = exports.IMAGE_FROM_URL = exports.HR = exports.HISTORY_UNDO = exports.HISTORY_REDO = exports.H6 = exports.H5 = exports.H4 = exports.H3 = exports.H2 = exports.H1 = exports.EM = exports.DOC_LAYOUT = exports.CLEAR_FORMAT = void 0;

var ProsemirrorTables = _interopRequireWildcard(require("prosemirror-tables"));

var _DocLayoutCommand = _interopRequireDefault(require("./DocLayoutCommand"));

var _HeadingCommand = _interopRequireDefault(require("./HeadingCommand"));

var _HistoryRedoCommand = _interopRequireDefault(require("./HistoryRedoCommand"));

var _HistoryUndoCommand = _interopRequireDefault(require("./HistoryUndoCommand"));

var _HorizontalRuleCommand = _interopRequireDefault(require("./HorizontalRuleCommand"));

var _ImageFromURLCommand = _interopRequireDefault(require("./ImageFromURLCommand"));

var _ImageUploadCommand = _interopRequireDefault(require("./ImageUploadCommand"));

var _IndentCommand = _interopRequireDefault(require("./IndentCommand"));

var _LinkSetURLCommand = _interopRequireDefault(require("./LinkSetURLCommand"));

var _ListItemInsertNewLineCommand = _interopRequireDefault(require("./ListItemInsertNewLineCommand"));

var _ListItemMergeCommand = _interopRequireDefault(require("./ListItemMergeCommand"));

var _ListSplitCommand = _interopRequireDefault(require("./ListSplitCommand"));

var _ListToggleCommand = _interopRequireDefault(require("./ListToggleCommand"));

var MarkNames = _interopRequireWildcard(require("./MarkNames"));

var _MarkToggleCommand = _interopRequireDefault(require("./MarkToggleCommand"));

var _MarksClearCommand = _interopRequireDefault(require("./MarksClearCommand"));

var _MathEditCommand = _interopRequireDefault(require("./MathEditCommand"));

var _PrintCommand = _interopRequireDefault(require("./PrintCommand"));

var _TableBackgroundColorCommand = _interopRequireDefault(require("./TableBackgroundColorCommand"));

var _TableBorderColorCommand = _interopRequireDefault(require("./TableBorderColorCommand"));

var _TableInsertCommand = _interopRequireDefault(require("./TableInsertCommand"));

var _TableMergeCellsCommand = _interopRequireDefault(require("./TableMergeCellsCommand"));

var _TextAlignCommand = _interopRequireDefault(require("./TextAlignCommand"));

var _TextColorCommand = _interopRequireDefault(require("./TextColorCommand"));

var _TextHighlightCommand = _interopRequireDefault(require("./TextHighlightCommand"));

var _TextInsertTabSpaceCommand = _interopRequireDefault(require("./TextInsertTabSpaceCommand"));

var _TextLineSpacingCommand = _interopRequireDefault(require("./TextLineSpacingCommand"));

var _createCommand = _interopRequireDefault(require("./createCommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// [FS][07-MAY-2020][IRAD-956]
// import BlockquoteInsertNewLineCommand from './BlockquoteInsertNewLineCommand';
// import BlockquoteToggleCommand from './BlockquoteToggleCommand';
const {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  // columnResizing,
  deleteColumn,
  deleteRow,
  deleteTable,
  // fixTables,
  goToNextCell,
  // mergeCells,
  // setCellAttr,
  splitCell,
  // tableEditing,
  // tableNodes,
  toggleHeaderCell,
  toggleHeaderColumn,
  toggleHeaderRow
} = ProsemirrorTables;
const {
  MARK_STRONG,
  MARK_EM,
  MARK_STRIKE,
  MARK_SUPER,
  MARK_SUB,
  MARK_UNDERLINE
} = MarkNames; // Note that Firefox will, by default, add various kinds of controls to
// editable tables, even though those don't work in ProseMirror. The only way
// to turn these off is globally, which you might want to do with the
// following code:

document.execCommand('enableObjectResizing', false, 'false');
document.execCommand('enableInlineTableEditing', false, 'false'); // [FS][07-MAY-2020][IRAD-956]
//  export const BLOCKQUOTE_TOGGLE = new BlockquoteToggleCommand();
//  export const BLOCKQUOTE_INSERT_NEW_LINE = new BlockquoteInsertNewLineCommand();

const CLEAR_FORMAT = new _MarksClearCommand.default();
exports.CLEAR_FORMAT = CLEAR_FORMAT;
const DOC_LAYOUT = new _DocLayoutCommand.default();
exports.DOC_LAYOUT = DOC_LAYOUT;
const EM = new _MarkToggleCommand.default(MARK_EM);
exports.EM = EM;
const H1 = new _HeadingCommand.default(1);
exports.H1 = H1;
const H2 = new _HeadingCommand.default(2);
exports.H2 = H2;
const H3 = new _HeadingCommand.default(3);
exports.H3 = H3;
const H4 = new _HeadingCommand.default(4);
exports.H4 = H4;
const H5 = new _HeadingCommand.default(5);
exports.H5 = H5;
const H6 = new _HeadingCommand.default(6);
exports.H6 = H6;
const HISTORY_REDO = new _HistoryRedoCommand.default();
exports.HISTORY_REDO = HISTORY_REDO;
const HISTORY_UNDO = new _HistoryUndoCommand.default();
exports.HISTORY_UNDO = HISTORY_UNDO;
const HR = new _HorizontalRuleCommand.default();
exports.HR = HR;
const IMAGE_FROM_URL = new _ImageFromURLCommand.default();
exports.IMAGE_FROM_URL = IMAGE_FROM_URL;
const IMAGE_UPLOAD = new _ImageUploadCommand.default();
exports.IMAGE_UPLOAD = IMAGE_UPLOAD;
const INDENT_LESS = new _IndentCommand.default(-1);
exports.INDENT_LESS = INDENT_LESS;
const INDENT_MORE = new _IndentCommand.default(1);
exports.INDENT_MORE = INDENT_MORE;
const LINK_SET_URL = new _LinkSetURLCommand.default();
exports.LINK_SET_URL = LINK_SET_URL;
const LIST_ITEM_INSERT_NEW_LINE = new _ListItemInsertNewLineCommand.default();
exports.LIST_ITEM_INSERT_NEW_LINE = LIST_ITEM_INSERT_NEW_LINE;
const LIST_ITEM_MERGE_DOWN = new _ListItemMergeCommand.default('down');
exports.LIST_ITEM_MERGE_DOWN = LIST_ITEM_MERGE_DOWN;
const LIST_ITEM_MERGE_UP = new _ListItemMergeCommand.default('up');
exports.LIST_ITEM_MERGE_UP = LIST_ITEM_MERGE_UP;
const LIST_SPLIT = new _ListSplitCommand.default();
exports.LIST_SPLIT = LIST_SPLIT;
const MATH_EDIT = new _MathEditCommand.default();
exports.MATH_EDIT = MATH_EDIT;
const OL = new _ListToggleCommand.default(true);
exports.OL = OL;
const PRINT = new _PrintCommand.default();
exports.PRINT = PRINT;
const STRIKE = new _MarkToggleCommand.default(MARK_STRIKE);
exports.STRIKE = STRIKE;
const STRONG = new _MarkToggleCommand.default(MARK_STRONG);
exports.STRONG = STRONG;
const SUPER = new _MarkToggleCommand.default(MARK_SUPER);
exports.SUPER = SUPER;
const SUB = new _MarkToggleCommand.default(MARK_SUB);
exports.SUB = SUB;
const TABLE_ADD_COLUMN_AFTER = (0, _createCommand.default)(addColumnAfter);
exports.TABLE_ADD_COLUMN_AFTER = TABLE_ADD_COLUMN_AFTER;
const TABLE_ADD_COLUMN_BEFORE = (0, _createCommand.default)(addColumnBefore);
exports.TABLE_ADD_COLUMN_BEFORE = TABLE_ADD_COLUMN_BEFORE;
const TABLE_ADD_ROW_AFTER = (0, _createCommand.default)(addRowAfter);
exports.TABLE_ADD_ROW_AFTER = TABLE_ADD_ROW_AFTER;
const TABLE_ADD_ROW_BEFORE = (0, _createCommand.default)(addRowBefore);
exports.TABLE_ADD_ROW_BEFORE = TABLE_ADD_ROW_BEFORE;
const TABLE_BACKGROUND_COLOR = new _TableBackgroundColorCommand.default();
exports.TABLE_BACKGROUND_COLOR = TABLE_BACKGROUND_COLOR;
const TABLE_BORDER_COLOR = new _TableBorderColorCommand.default();
exports.TABLE_BORDER_COLOR = TABLE_BORDER_COLOR;
const TABLE_DELETE_COLUMN = (0, _createCommand.default)(deleteColumn);
exports.TABLE_DELETE_COLUMN = TABLE_DELETE_COLUMN;
const TABLE_DELETE_ROW = (0, _createCommand.default)(deleteRow);
exports.TABLE_DELETE_ROW = TABLE_DELETE_ROW;
const TABLE_DELETE_TABLE = (0, _createCommand.default)(deleteTable);
exports.TABLE_DELETE_TABLE = TABLE_DELETE_TABLE;
const TABLE_INSERT_TABLE = new _TableInsertCommand.default();
exports.TABLE_INSERT_TABLE = TABLE_INSERT_TABLE;
const TABLE_MERGE_CELLS = new _TableMergeCellsCommand.default();
exports.TABLE_MERGE_CELLS = TABLE_MERGE_CELLS;
const TABLE_MOVE_TO_NEXT_CELL = (0, _createCommand.default)(goToNextCell(1));
exports.TABLE_MOVE_TO_NEXT_CELL = TABLE_MOVE_TO_NEXT_CELL;
const TABLE_MOVE_TO_PREV_CELL = (0, _createCommand.default)(goToNextCell(-1));
exports.TABLE_MOVE_TO_PREV_CELL = TABLE_MOVE_TO_PREV_CELL;
const TABLE_SPLIT_ROW = (0, _createCommand.default)(splitCell);
exports.TABLE_SPLIT_ROW = TABLE_SPLIT_ROW;
const TABLE_TOGGLE_HEADER_CELL = (0, _createCommand.default)(toggleHeaderCell);
exports.TABLE_TOGGLE_HEADER_CELL = TABLE_TOGGLE_HEADER_CELL;
const TABLE_TOGGLE_HEADER_COLUMN = (0, _createCommand.default)(toggleHeaderColumn);
exports.TABLE_TOGGLE_HEADER_COLUMN = TABLE_TOGGLE_HEADER_COLUMN;
const TABLE_TOGGLE_HEADER_ROW = (0, _createCommand.default)(toggleHeaderRow);
exports.TABLE_TOGGLE_HEADER_ROW = TABLE_TOGGLE_HEADER_ROW;
const TEXT_ALIGN_CENTER = new _TextAlignCommand.default('center');
exports.TEXT_ALIGN_CENTER = TEXT_ALIGN_CENTER;
const TEXT_ALIGN_JUSTIFY = new _TextAlignCommand.default('justify');
exports.TEXT_ALIGN_JUSTIFY = TEXT_ALIGN_JUSTIFY;
const TEXT_ALIGN_LEFT = new _TextAlignCommand.default('left');
exports.TEXT_ALIGN_LEFT = TEXT_ALIGN_LEFT;
const TEXT_ALIGN_RIGHT = new _TextAlignCommand.default('right');
exports.TEXT_ALIGN_RIGHT = TEXT_ALIGN_RIGHT;
const TEXT_COLOR = new _TextColorCommand.default();
exports.TEXT_COLOR = TEXT_COLOR;
const TEXT_HIGHLIGHT = new _TextHighlightCommand.default();
exports.TEXT_HIGHLIGHT = TEXT_HIGHLIGHT;
const TEXT_INSERT_TAB_SPACE = new _TextInsertTabSpaceCommand.default();
exports.TEXT_INSERT_TAB_SPACE = TEXT_INSERT_TAB_SPACE;

const TEXT_LINE_SPACINGS = _TextLineSpacingCommand.default.createGroup();

exports.TEXT_LINE_SPACINGS = TEXT_LINE_SPACINGS;
const UL = new _ListToggleCommand.default(false);
exports.UL = UL;
const UNDERLINE = new _MarkToggleCommand.default(MARK_UNDERLINE);
exports.UNDERLINE = UNDERLINE;