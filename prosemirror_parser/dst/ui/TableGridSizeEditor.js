"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _clamp = _interopRequireDefault(require("./clamp"));

var _htmlElementToRect = _interopRequireDefault(require("./htmlElementToRect"));

var _rects = require("./rects");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const GUTTER_SIZE = 5;
const CELL_SIZE = 16; // [FS] IRAD-1012 2020-07-14
// Fix: Limited Table Grid size from 20 to 7

const MAX_SIZE = 7;

class GridCell extends React.PureComponent {
  render() {
    const {
      x,
      y,
      selected
    } = this.props;
    const style = {
      left: x + 'px',
      top: y + 'px',
      width: CELL_SIZE + 'px',
      height: CELL_SIZE + 'px'
    };
    const className = (0, _classnames.default)('czi-table-grid-size-editor-cell', {
      selected
    });
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      style: style
    });
  }

}

class TableGridSizeEditor extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "_ex", 0);

    _defineProperty(this, "_ey", 0);

    _defineProperty(this, "_mx", 0);

    _defineProperty(this, "_my", 0);

    _defineProperty(this, "_rafID", 0);

    _defineProperty(this, "_ref", null);

    _defineProperty(this, "_entered", false);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "state", {
      rows: 1,
      cols: 1
    });

    _defineProperty(this, "_onRef", ref => {
      this._ref = ref;
    });

    _defineProperty(this, "_onMouseEnter", e => {
      const node = e.currentTarget;

      if (node instanceof HTMLElement) {
        const rect = (0, _rects.fromHTMlElement)(node);
        const mx = Math.round(e.clientX);
        const my = Math.round(e.clientY);
        this._ex = rect.x;
        this._ey = rect.y;
        this._mx = mx;
        this._my = my;

        if (!this._entered) {
          this._entered = true;
          document.addEventListener('mousemove', this._onMouseMove, true);
        }
      }
    });

    _defineProperty(this, "_onMouseMove", e => {
      const el = this._ref && _reactDom.default.findDOMNode(this._ref);

      const elRect = el ? (0, _htmlElementToRect.default)(el) : null;
      const mouseRect = (0, _rects.fromXY)(e.screenX, e.screenY, 10);

      if (elRect && mouseRect && (0, _rects.isIntersected)(elRect, mouseRect, 50)) {
        // This prevents `PopUpManager` from collapsing the editor.
        e.preventDefault();
        e.stopImmediatePropagation();
      }

      const mx = Math.round(e.clientX);
      const my = Math.round(e.clientY);

      if (mx !== this._mx || my !== this._my) {
        this._mx = mx;
        this._my = my;
        this._rafID && cancelAnimationFrame(this._rafID);
        this._rafID = requestAnimationFrame(this._updateGridSize);
      }
    });

    _defineProperty(this, "_updateGridSize", () => {
      this._rafID = 0;
      const mx = this._mx;
      const my = this._my;
      const x = mx - this._ex;
      const y = my - this._ey;
      const rr = (0, _clamp.default)(1, Math.ceil(y / (CELL_SIZE + GUTTER_SIZE)), MAX_SIZE);
      const cc = (0, _clamp.default)(1, Math.ceil(x / (CELL_SIZE + GUTTER_SIZE)), MAX_SIZE);
      const {
        rows,
        cols
      } = this.state;

      if (rows !== rr || cols !== cc) {
        this.setState({
          rows: rr,
          cols: cc
        });
      }
    });

    _defineProperty(this, "_onMouseDown", e => {
      e.preventDefault();
      this.props.close(this.state);
    });
  }

  componentWillUnmount() {
    if (this._entered) {
      document.removeEventListener('mousemove', this._onMouseMove, true);
    }

    this._rafID && cancelAnimationFrame(this._rafID);
  }

  render() {
    const {
      rows,
      cols
    } = this.state;
    let rr = Math.max(5, rows);
    let cc = Math.max(5, cols);

    if (rr === rows) {
      rr = Math.min(MAX_SIZE, rr + 1);
    }

    if (cc === cols) {
      cc = Math.min(MAX_SIZE, cc + 1);
    }

    const cells = [];
    let ii = 0;
    let y = 0;
    let w = 0;
    let h = 0;

    while (ii < rr) {
      y += GUTTER_SIZE;
      let jj = 0;
      let x = 0;

      while (jj < cc) {
        x += GUTTER_SIZE;
        const selected = ii < rows && jj < cols;
        cells.push( /*#__PURE__*/React.createElement(GridCell, {
          key: `${String(ii)}-${String(jj)}`,
          selected: selected,
          x: x,
          y: y
        }));
        x += CELL_SIZE;
        w = x + GUTTER_SIZE;
        jj++;
      }

      y += CELL_SIZE;
      h = y + GUTTER_SIZE;
      ii++;
    }

    const bodyStyle = {
      width: w + 'px',
      height: h + 'px'
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "czi-table-grid-size-editor",
      ref: this._onRef
    }, /*#__PURE__*/React.createElement("div", {
      className: "czi-table-grid-size-editor-body",
      onMouseDown: this._onMouseDown,
      onMouseEnter: this._onMouseEnter,
      style: bodyStyle
    }, cells), /*#__PURE__*/React.createElement("div", {
      className: "czi-table-grid-size-editor-footer"
    }, rows, " X ", cols));
  }

}

var _default = TableGridSizeEditor;
exports.default = _default;