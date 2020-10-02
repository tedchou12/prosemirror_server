"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = injectStyleSheet;

var _url = _interopRequireDefault(require("url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const addedElements = new Map();

function createElement(tag, attrs) {
  const el = document.createElement(tag);
  Object.keys(attrs).forEach(key => {
    if (key === 'className') {
      el[key] = attrs[key];
    } else {
      el.setAttribute(key, attrs[key]);
    }
  });
  return el;
}

function injectStyleSheet(urlStr) {
  const parsedURL = _url.default.parse(urlStr);

  const {
    protocol
  } = parsedURL;
  const protocolPattern = /^(http:|https:)/;

  if (!protocolPattern.test(protocol || '')) {
    if (protocolPattern.test(window.location.protocol)) {
      parsedURL.protocol = window.location.protocol;
    } else {
      parsedURL.protocol = 'http:';
    }
  }

  const href = _url.default.format(parsedURL);

  if (addedElements.has(href)) {
    return;
  }

  const el = createElement('link', {
    crossorigin: 'anonymous',
    href,
    rel: 'stylesheet'
  });
  addedElements.set(href, el);
  const root = document.head || document.documentElement || document.body;
  root && root.appendChild(el);
}