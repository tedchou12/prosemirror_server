"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderLaTeXAsHTML;

var _canUseCSSFont = _interopRequireDefault(require("./canUseCSSFont"));

var _katex = _interopRequireDefault(require("katex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const latexEl = document.createElement('div');
const cached = {}; // Use KatexVersion "0.10.1" to fix format issue.
// See https://github.com/sailinglab/pgm-spring-2019/pull/30

const CSS_CDN_URL = '//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.1/katex.min.css';
const CSS_FONT = 'KaTeX_Main';

(async function () {
  const fontSupported = await (0, _canUseCSSFont.default)(CSS_FONT);

  if (!fontSupported) {
    console.info('Add CSS from ', CSS_CDN_URL); // [FS] IRAD-1061 2020-09-19
    // Now loaded locally, so that it work in closed network as well.
    //injectStyleSheet(CSS_CDN_URL);
  }
})();

function renderLaTeXAsHTML(latex) {
  if (cached.hasOwnProperty(latex)) {
    return cached[latex];
  }

  const latexText = latex || '';
  latexEl.innerHTML = '';

  if (!latexText) {
    return latexText;
  }

  try {
    _katex.default.render(latex, latexEl);
  } catch (ex) {
    console.warn(ex.message, latex);
    latexEl.innerHTML = '';
    latexEl.appendChild(document.createTextNode(latexText));
  }

  const html = latexEl.innerHTML;
  latexEl.innerHTML = '';
  cached[latex] = html;
  return html;
}