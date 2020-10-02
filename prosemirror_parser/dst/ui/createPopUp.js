"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createPopUp;

var _PopUp = _interopRequireDefault(require("./PopUp"));

var React = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _uuid = _interopRequireDefault(require("./uuid"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-unused-vars
let modalsCount = 0;
let popUpsCount = 0;
const Z_INDEX_BASE = 9999;
const MODAL_MASK_ID = 'pop-up-modal-mask-' + (0, _uuid.default)();

function showModalMask() {
  const root = document.body || document.documentElement;
  let element = document.getElementById(MODAL_MASK_ID);

  if (!element) {
    element = document.createElement('div');
    element.id = MODAL_MASK_ID;
    element.className = 'czi-pop-up-modal-mask';
    element.setAttribute('data-mask-type', 'czi-pop-up-modal-mask');
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
  }

  if (root && !element.parentElement) {
    root.appendChild(element);
  }

  const style = element.style;
  const selector = '.czi-pop-up-element[data-pop-up-modal]';
  const zIndex = Array.from(document.querySelectorAll(selector)).reduce((zz, el) => Math.max(zz, Number(el.style.zIndex)), 0);
  style.zIndex = zIndex - 1;
}

function hideModalMask() {
  const element = document.getElementById(MODAL_MASK_ID);

  if (element && element.parentElement) {
    element.parentElement.removeChild(element);
  }
}

function getRootElement(id, forceCreation, popUpParams) {
  const root = popUpParams && popUpParams.container || document.body || document.documentElement;
  let element = document.getElementById(id);

  if (!element && forceCreation) {
    element = document.createElement('div');
  }

  if (!element) {
    return null;
  }

  if (popUpParams && popUpParams.modal) {
    element.setAttribute('data-pop-up-modal', 'y');
  }

  element.className = 'czi-pop-up-element czi-vars';
  element.id = id;
  const style = element.style;
  const modalZIndexOffset = popUpParams && popUpParams.modal ? 1 : 0;

  if (!(popUpParams && popUpParams.container)) {
    style.zIndex = Z_INDEX_BASE + popUpsCount * 3 + modalZIndexOffset;
  } // Populates the default ARIA attributes here.
  // http://accessibility.athena-ict.com/aria/examples/dialog.shtml


  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');

  if (root && !element.parentElement) {
    root.appendChild(element);
  }

  return element;
}

function renderPopUp(rootId, close, View, viewProps, popUpParams) {
  const rootNode = getRootElement(rootId, true, popUpParams);

  if (rootNode) {
    const component = /*#__PURE__*/React.createElement(_PopUp.default, {
      View: View,
      close: close,
      popUpParams: popUpParams,
      viewProps: viewProps
    });

    _reactDom.default.render(component, rootNode);
  }

  if (modalsCount > 0) {
    showModalMask();
  } else {
    hideModalMask();
  }
}

function unrenderPopUp(rootId) {
  const rootNode = getRootElement(rootId, false);

  if (rootNode) {
    _reactDom.default.unmountComponentAtNode(rootNode);

    rootNode.parentElement && rootNode.parentElement.removeChild(rootNode);
  }

  if (modalsCount === 0) {
    hideModalMask();
  }
}

function createPopUp(View, viewProps, popUpParams) {
  const rootId = (0, _uuid.default)();
  let handle = null;
  let currentViewProps = viewProps;
  viewProps = viewProps || {};
  popUpParams = popUpParams || {};
  const modal = popUpParams.modal || !popUpParams.anchor;
  popUpParams.modal = modal;
  popUpsCount++;

  if (modal) {
    modalsCount++;
  }

  const closePopUp = value => {
    if (!handle) {
      return;
    }

    if (modal) {
      modalsCount--;
    }

    popUpsCount--;
    handle = null;
    unrenderPopUp(rootId);
    const onClose = popUpParams && popUpParams.onClose;
    onClose && onClose(value);
  };

  const render = renderPopUp.bind(null, rootId, closePopUp, View);
  const emptyObj = {};
  handle = {
    close: closePopUp,
    update: nextViewProps => {
      currentViewProps = nextViewProps;
      render(currentViewProps || emptyObj, popUpParams || emptyObj);
    }
  };
  render(currentViewProps || emptyObj, popUpParams || emptyObj);
  return handle;
}