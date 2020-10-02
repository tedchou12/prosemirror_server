"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchTableElements;

var _convertToCSSPTValue = _interopRequireWildcard(require("./convertToCSSPTValue"));

var _toHexColor = _interopRequireDefault(require("./ui/toHexColor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function patchTableElements(doc) {
  Array.from(doc.querySelectorAll('td')).forEach(patchTableCell);
  Array.from(doc.querySelectorAll('tr[style^=height]')).forEach(patchTableRow);
} // The height of each line: ~= 21px


const LINE_HEIGHT_PT_VALUE = 15.81149997; // Workaround to patch HTML from Google Doc that Table Cells will apply
// its background colr to all its inner <span />.

function patchTableCell(tdElement) {
  const {
    style
  } = tdElement;

  if (!style) {
    return;
  }

  const {
    backgroundColor,
    width
  } = style;

  if (backgroundColor) {
    const tdBgColor = (0, _toHexColor.default)(backgroundColor);
    const selector = 'span[style*=background-color]';
    const spans = Array.from(tdElement.querySelectorAll(selector));
    spans.some(spanElement => {
      const spanStyle = spanElement.style;

      if (!spanStyle || !spanStyle.backgroundColor) {
        return;
      }

      const spanBgColor = (0, _toHexColor.default)(spanStyle.backgroundColor);

      if (spanBgColor === tdBgColor) {
        // The span has the same bg color as the cell does, erase its bg color.
        spanStyle.backgroundColor = '';
      }
    });
  }

  if (width) {
    const ptValue = (0, _convertToCSSPTValue.default)(width);

    if (!ptValue) {
      return;
    }

    const pxValue = ptValue * _convertToCSSPTValue.PT_TO_PX_RATIO; // Attribute "data-colwidth" is defined at 'prosemirror-tables';

    tdElement.setAttribute('data-colwidth', String(Math.round(pxValue)));
  }
} // Workaround to support "height" in table row by inject empty <p /> to
// create space for the height.


function patchTableRow(trElement) {
  const doc = trElement.ownerDocument;

  if (!doc) {
    return;
  }

  const height = trElement.style.height;

  if (!height) {
    return;
  }

  const firstCell = trElement.querySelector('td, th');

  if (!firstCell) {
    return;
  }

  const ptValue = (0, _convertToCSSPTValue.default)(height);

  if (!ptValue) {
    return;
  }

  const pEls = firstCell.querySelectorAll('p');
  const heightNeeded = ptValue - LINE_HEIGHT_PT_VALUE * pEls.length;

  if (heightNeeded < 0) {
    return;
  }

  let pElsNeeded = Math.round(heightNeeded / LINE_HEIGHT_PT_VALUE);

  if (pElsNeeded <= 0) {
    return;
  }

  const frag = doc.createDocumentFragment();
  const line = doc.createElement('p');

  while (pElsNeeded > 0) {
    pElsNeeded--;
    frag.appendChild(line.cloneNode(false));
  }

  firstCell.appendChild(frag);
}