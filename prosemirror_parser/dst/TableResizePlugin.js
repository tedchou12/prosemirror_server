"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TableNodeView = _interopRequireDefault(require("./ui/TableNodeView"));

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorView = require("prosemirror-view");

var _prosemirrorUtils = require("prosemirror-utils");

var _nullthrows = _interopRequireDefault(require("nullthrows"));

var _prosemirrorTables = require("prosemirror-tables");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const PLUGIN_KEY = new _prosemirrorState.PluginKey('tableColumnResizing'); // [FS] IRAD-949 2020-05-27
// Fix:Cell Resize Handler causes edit diificult to firsrst/last two chars in the cell.
// Rezie cursor position issue fixed.

const CELL_MIN_WIDTH = 30;
const HANDLE_WIDTH = 5;
const HANDLE_RIGHT_WIDTH = 20;
let cancelDrag = null;
let isEnabled = true; // The immutable plugin state that stores the information for resizing.

class ResizeState {
  constructor(cellPos, forMarginLeft, draggingInfo) {
    _defineProperty(this, "cellPos", void 0);

    _defineProperty(this, "forMarginLeft", void 0);

    _defineProperty(this, "draggingInfo", void 0);

    this.cellPos = cellPos;
    this.draggingInfo = draggingInfo;
    this.forMarginLeft = forMarginLeft;
  }

  apply(tr) {
    let state = this;
    const action = tr.getMeta(PLUGIN_KEY);

    if (action && typeof action.setCellPos === 'number') {
      return new ResizeState(action.setCellPos, action.setForMarginLeft, null);
    }

    if (action && action.setDraggingInfo !== undefined) {
      return new ResizeState(state.cellPos, state.forMarginLeft, action.setDraggingInfo);
    }

    if (state.cellPos && state.cellPos > -1 && tr.docChanged) {
      let cellPos = tr.mapping.map(state.cellPos, -1);

      if (!(0, _prosemirrorTables.pointsAtCell)(tr.doc.resolve(cellPos))) {
        cellPos = null;
      }

      state = new ResizeState(cellPos, cellPos ? state.forMarginLeft : false, state.draggingInfo);
    }

    return state;
  }

} // Function that handles the mousemove event inside table cell.


function handleMouseMove(view, event) {
  const resizeState = PLUGIN_KEY.getState(view.state);

  if (resizeState.draggingInfo) {
    return;
  }

  const target = domCellAround(event.target);
  let forMarginLeft = false;
  let cell = -1;

  if (target instanceof HTMLTableCellElement) {
    const {
      left,
      right
    } = target.getBoundingClientRect();
    const offsetLeft = event.clientX - left; // [FS] IRAD-949 2020-05-27
    // Fix:Cell Resize Handler causes edit diificult to firsrst/last two chars in the cell.
    // Rezie cursor position issue fixed.

    if (offsetLeft <= HANDLE_WIDTH) {
      if (target.cellIndex === 0) {
        forMarginLeft = true;
        cell = edgeCell(view, event, 'right');
      } else {
        cell = edgeCell(view, event, 'left');
      }
    } else if (right - event.clientX <= HANDLE_WIDTH) {
      cell = edgeCell(view, event, 'right');
    }
  }

  if (cell === resizeState.cellPos && forMarginLeft === resizeState.forMarginLeft) {
    return;
  }

  if (cell !== -1) {
    const $cell = view.state.doc.resolve(cell);

    if (!$cell) {
      return;
    }
  }

  updateResizeHandle(view, cell, forMarginLeft);
} // Function that handles the mouseleave event from the table cell.


function handleMouseLeave(view) {
  const resizeState = PLUGIN_KEY.getState(view.state);
  const {
    cellPos,
    draggingInfo
  } = resizeState;

  if (cellPos > -1 && !draggingInfo) {
    updateResizeHandle(view, -1, false);
  }
} // Function that handles the mousedown event from the table cell.


function handleMouseDown(view, event) {
  // It's possible that the resize action that happened earlier was inturrupted
  // while its dependent mouse events were stopped or prevented by others.
  // We need to stop the previous resize action if it did not finish.
  cancelDrag && cancelDrag(event);
  const resizeState = PLUGIN_KEY.getState(view.state);

  if (resizeState.cellPos === -1 || resizeState.draggingInfo) {
    return false;
  }

  let dragStarted = false;
  let dragMoveHandler = null;

  const finish = event => {
    window.removeEventListener('mouseup', finish, true);
    window.removeEventListener('mousemove', move, true);
    dragStarted && handleDragEnd(view, event);
    cancelDrag = null;
  };

  const move = event => {
    if (event.which) {
      if (!dragStarted) {
        handleDragStart(view, event);
        dragStarted = true;
      } // Move events should be batched to avoid over-handling the mouse
      // event.


      dragMoveHandler = dragMoveHandler || batchMouseHandler(handleDragMove);
      dragMoveHandler(view, event);
    } else {
      finish(event);
    }
  };

  cancelDrag = finish;
  window.addEventListener('mouseup', finish, true);
  window.addEventListener('mousemove', move, true);
  event.preventDefault();
  return true;
}

function handleDragStart(view, event) {
  const resizeState = PLUGIN_KEY.getState(view.state);

  if (resizeState.cellPos === -1 || resizeState.draggingInfo) {
    return;
  }

  view.dispatch(view.state.tr.setMeta(PLUGIN_KEY, {
    setDraggingInfo: calculateDraggingInfo(view, event, resizeState)
  }));
} // Function that handles the mouse event while resizing the table cell.
// This will temporarily updates the table's style until the resize ends.


function handleDragMove(view, event) {
  const resizeState = PLUGIN_KEY.getState(view.state);
  const {
    draggingInfo,
    forMarginLeft
  } = resizeState;

  if (!draggingInfo) {
    return;
  }

  const {
    startX,
    columnWidths,
    taregtColumnIndex,
    columnElements,
    tableElement,
    tableMarginLeft,
    tableMarginRight
  } = draggingInfo;
  let totalWidth = 0;
  let ml = tableMarginLeft;
  const dx = event.clientX - startX;
  const lastIndex = columnWidths.length - 1;
  const widths = columnWidths.map((cw, index) => {
    let ww;

    if (forMarginLeft) {
      if (index === 0) {
        // Resize the first column.
        ww = Math.min(Math.max(CELL_MIN_WIDTH, cw - dx), cw + tableMarginLeft); // Resize table's left margin.

        ml = Math.max(0, tableMarginLeft + cw - ww);
      } else {
        // The rest columns remain the same,
        ww = cw;
      }
    } else if (index === taregtColumnIndex && index === lastIndex) {
      // Resize the last column.
      ww = Math.min(cw + tableMarginRight, Math.max(CELL_MIN_WIDTH, cw + dx));
    } else if (index === taregtColumnIndex) {
      // Resize the column.
      ww = Math.min(Math.max(CELL_MIN_WIDTH, cw + dx), cw + (columnWidths[index + 1] || 0) - CELL_MIN_WIDTH);
    } else if (index === taregtColumnIndex + 1) {
      // Resize the column's previous column.
      ww = Math.min(Math.max(CELL_MIN_WIDTH, cw - dx), cw + (columnWidths[index - 1] || 0) - CELL_MIN_WIDTH);
    } else {
      // This column does not resize.
      ww = cw;
    }

    totalWidth += ww;
    return ww;
  });
  const tableElementStyle = tableElement.style;
  tableElementStyle.marginLeft = `${ml}px`; // [FS] IRAD-993 2020-06-26
  // Fix:Table exceeds the canvas

  tableElementStyle.width = Math.round(totalWidth - ml) + 'px';
  tableElementStyle.minWidth = '';
  columnElements.forEach((colEl, index) => {
    colEl.style.width = Math.round(widths[index]) + 'px';
  });
} // Function that handles the mouse event while stop resizing the table cell.


function handleDragEnd(view, event) {
  const resizeState = PLUGIN_KEY.getState(view.state);
  const {
    cellPos,
    draggingInfo
  } = resizeState;

  if (!draggingInfo) {
    return;
  }

  const {
    columnElements,
    tableElement
  } = draggingInfo;
  const widths = columnElements.map(colEl => {
    return parseFloat(colEl.style.width);
  });
  const $cell = view.state.doc.resolve(cellPos);
  const start = $cell.start(-1);
  const table = $cell.node(-1);

  const map = _prosemirrorTables.TableMap.get(table);

  let tr = view.state.tr;

  for (let row = 0; row < map.height; row++) {
    for (let col = 0; col < widths.length; col++) {
      const mapIndex = row * map.width + col;

      if (row && map.map[mapIndex] == map.map[mapIndex - map.width]) {
        // Rowspanning cell that has already been handled
        continue;
      }

      const pos = map.map[mapIndex];
      const {
        attrs
      } = table.nodeAt(pos);
      const colspan = attrs.colspan || 1;
      const colwidth = widths.slice(col, col + colspan);

      if (colspan > 1) {
        // The current cell spans across multiple columns, this forwards to
        // the next cell for the next iteration.
        col += colspan - 1;
      }

      if (attrs.colwidth && compareNumbersList(attrs.colwidth, colwidth)) {
        continue;
      }

      tr = tr.setNodeMarkup(start + pos, null, (0, _prosemirrorTables.setAttr)(attrs, 'colwidth', colwidth));
    }
  }

  const marginLeft = parseFloat(tableElement.style.marginLeft) || null;

  if (table.attrs.marginLeft !== marginLeft) {
    const nodeType = table.type;
    const attrs = { ...table.attrs,
      marginLeft
    };
    const tableLookup = (0, _prosemirrorUtils.findParentNodeOfTypeClosestToPos)($cell, view.state.schema.nodes[nodeType.name]);
    const tablePos = (0, _nullthrows.default)(tableLookup && tableLookup.pos);
    tr = tr.setNodeMarkup(tablePos, nodeType, attrs);
  }

  if (tr.docChanged) {
    // Let editor know the change.
    view.dispatch(tr);
  } // Hides the resize handle bars.


  view.dispatch(view.state.tr.setMeta(PLUGIN_KEY, {
    setDraggingInfo: null
  }));
} // Helper that prepares the information needed before the resizing starts.


function calculateDraggingInfo(view, event, resizeState) {
  const {
    cellPos,
    forMarginLeft
  } = resizeState;
  const dom = view.domAtPos(cellPos);
  const tableEl = dom.node.closest('table');
  const tableWrapper = tableEl.closest('.tableWrapper');
  const colGroupEl = tableEl.querySelector('colgroup');
  const colEls = colGroupEl ? Array.from(colGroupEl.querySelectorAll('col')) : [];
  const tableWrapperRect = tableWrapper.getBoundingClientRect();
  const tableRect = tableEl.getBoundingClientRect();
  const defaultColumnWidth = tableWrapperRect.width / colEls.length;
  const startX = event.clientX;
  const offsetLeft = startX - tableRect.left;
  let tableWidth = 0;
  let taregtColumnIndex = -1;
  const tableMarginLeftStyle = tableEl.style.marginLeft;
  const tableMarginLeft = tableMarginLeftStyle && /\d+px/.test(tableMarginLeftStyle) ? parseFloat(tableMarginLeftStyle) : 0;
  const tableMarginRight = tableWrapperRect.right - tableRect.right; // Calculate the inital width of each column.
  // Calculate the inital width of the table.
  // Find out the target column to resize.

  const columnWidths = Array.from(colEls).map((colEl, ii) => {
    const cssWidth = colEl.style.width;
    let colWidth = Math.max(CELL_MIN_WIDTH, cssWidth && parseFloat(cssWidth) || defaultColumnWidth);

    if (tableWidth + colWidth > tableWrapperRect.width) {
      // column is too wide, make it fit.
      // colWidth -= tableWrapperRect.width - (tableWidth + colWidth);
      // [FS] IRAD-993 2020-06-24
      // Fix:Table exceeds the canvas
      const tosub = Math.abs(tableWrapperRect.width - (tableWidth + colWidth));
      colWidth = colWidth - tosub;
    } // The edges of the column's right border.
    // [FS] IRAD-949 2020-05-27
    // Fix:Cell Resize Handler causes edit diificult to firsrst/last two chars in the cell.


    const edgeLeft = tableWidth + colWidth - HANDLE_RIGHT_WIDTH / 2;
    const edgeRight = tableWidth + colWidth + HANDLE_RIGHT_WIDTH / 2;

    if (offsetLeft >= edgeLeft && offsetLeft <= edgeRight) {
      // [FS] IRAD-993 2020-06-24
      // Fix:Table exceeds the canvas
      if (taregtColumnIndex === -1) {
        // This is the column to resize.
        taregtColumnIndex = ii;
      }
    }

    tableWidth += colWidth;
    return colWidth;
  });

  if (forMarginLeft) {
    // Both the first column and the table's left margin should resize.
    taregtColumnIndex = 0;
  }

  if (taregtColumnIndex < 0) {
    // Nothing to resize. This happens when the mouse isn't nearby any position
    // that is alllowed to resize a column.
    return null;
  }

  return {
    columnElements: colEls,
    taregtColumnIndex,
    columnWidths,
    startX,
    tableElement: tableEl,
    tableMarginLeft,
    tableMarginRight,
    tableWidth,
    tableWrapperWidth: tableWrapperRect.width
  };
} // Helper that finds the closest cell element from a given event target.


function domCellAround(target) {
  while (target && target.nodeName !== 'TD' && target.nodeName !== 'TH') {
    target = target.classList.contains('ProseMirror') ? null : target.parentElement;
  }

  return target;
} // Helper that resolves the prose-mirror node postion of a cell from a given
// event target.


function edgeCell(view, event, side) {
  const {
    pos
  } = view.posAtCoords({
    left: event.clientX,
    top: event.clientY
  });
  const $cell = (0, _prosemirrorTables.cellAround)(view.state.doc.resolve(pos));

  if (!$cell) {
    return -1;
  }

  if (side == 'right') {
    return $cell.pos;
  }

  const map = _prosemirrorTables.TableMap.get($cell.node(-1));

  const start = $cell.start(-1);
  const index = map.map.indexOf($cell.pos - start);
  return index % map.width == 0 ? -1 : start + map.map[index - 1];
} // Update the resize handler (UI) state.


function updateResizeHandle(view, cellPos, forMarginLeft) {
  view.dispatch(view.state.tr.setMeta(PLUGIN_KEY, {
    setCellPos: cellPos,
    setForMarginLeft: forMarginLeft
  }));
} // Get the decorations that renders the resize handle bars.


function handleDecorations(state, resizeState) {
  if (!resizeState.cellPos) {
    return _prosemirrorView.DecorationSet.create(state.doc, []);
  }

  const decorations = [];
  const $cell = state.doc.resolve(resizeState.cellPos);
  const table = $cell.node(-1);

  const map = _prosemirrorTables.TableMap.get(table);

  const start = $cell.start(-1);
  const col = map.colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan;

  for (let row = 0; row < map.height; row++) {
    const index = col + row * map.width - 1; // For positions that are have either a different cell or the end
    // of the table to their right, and either the top of the table or
    // a different cell above them, add a decoration

    if ((col === map.width || map.map[index] !== map.map[index + 1]) && (row === 0 || map.map[index - 1] !== map.map[index - 1 - map.width])) {
      const cellPos = map.map[index];
      const pos = start + cellPos + table.nodeAt(cellPos).nodeSize - 1;
      const dom = document.createElement('div');
      let className = 'column-resize-handle';

      if (resizeState.forMarginLeft) {
        className += ' for-margin-left';
      }

      dom.className = className;
      decorations.push(_prosemirrorView.Decoration.widget(pos, dom));
    }
  }

  return _prosemirrorView.DecorationSet.create(state.doc, decorations);
} // Creates a custom table view that renders the margin-left style.


function createTableView(node, view) {
  // [FS] IRAD-1008 2020-07-16
  // Does not allow Table cell Resize in disable mode
  isEnabled = view.editable;
  return new _TableNodeView.default(node, CELL_MIN_WIDTH, view);
}

function batchMouseHandler(handler) {
  let target = null;
  let clientX = 0;
  let clientY = 0;
  let view = null;

  const onMouseEvent = () => {
    if (view && target) {
      let pointerEvent;
      pointerEvent = {
        target,
        clientX,
        clientY
      };
      handler(view, pointerEvent);
    }
  };

  return function (ev, me) {
    target = me.target;
    clientX = me.clientX;
    clientY = me.clientY;
    view = ev;
    requestAnimationFrame(onMouseEvent);
  };
}

function compareNumbersList(one, two) {
  if (one.length !== two.length) {
    return false;
  }

  return !one.some((value, index) => two[index] !== value);
} // Plugin that supports table columns resizing.


class TableResizePlugin extends _prosemirrorState.Plugin {
  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  //spec: Object;
  constructor() {
    super({
      key: PLUGIN_KEY,
      state: {
        init(_, state) {
          this.spec.props.nodeViews[(0, _prosemirrorTables.tableNodeTypes)(state.schema).table.name] = createTableView;
          return new ResizeState(-1, null);
        },

        apply(tr, prev) {
          return prev.apply(tr);
        }

      },
      props: {
        attributes(state) {
          const resizeState = PLUGIN_KEY.getState(state);
          return resizeState.cellPos > -1 ? {
            class: 'resize-cursor'
          } : null;
        },

        handleDOMEvents: {
          // Move events should be batched to avoid over-handling the mouse
          // event.
          mousemove: batchMouseHandler(handleMouseMove),
          mouseleave: handleMouseLeave,
          mousedown: handleMouseDown
        },

        decorations(state) {
          const resizeState = PLUGIN_KEY.getState(state); // [FS] IRAD-1008 2020-07-16
          // Does not allow Table cell Resize in disable mode

          return resizeState.cellPos > -1 && isEnabled ? handleDecorations(state, resizeState) : undefined;
        },

        nodeViews: {}
      }
    });
  }

}

exports.default = TableResizePlugin;