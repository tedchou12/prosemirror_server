"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nullthrows = _interopRequireDefault(require("nullthrows"));

var _uuid = _interopRequireDefault(require("./ui/uuid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Utility Class that allows developer to insert HTML snippets then updates
// document's innerHTML accordingly.
class HTMLMutator {
  constructor(doc) {
    _defineProperty(this, "_doc", void 0);

    _defineProperty(this, "_htmls", void 0);

    this._doc = doc;
    this._htmls = new Map();
  }

  insertHTMLBefore(html, el) {
    return this._insertHTML(html, 'before', el);
  }

  insertHTMLAfter(html, el) {
    return this._insertHTML(html, 'after', el);
  }

  execute() {
    const doc = this._doc;
    const root = (0, _nullthrows.default)(doc.body || doc.documentElement);
    let newHtml = root.innerHTML;

    this._htmls.forEach((html, token) => {
      newHtml = newHtml.replace(token, html);
    });

    root.innerHTML = newHtml;
  }

  _insertHTML(html, position, el) {
    if (el.ownerDocument !== this._doc) {
      throw new Error('element does not belong to the document');
    } // This does not insert the HTML into the document directly.
    // Instead, this inserts a comment token that can be replaced by the HTML
    // later.


    const token = `\u200b_HTMLMutator_token_${(0, _uuid.default)()}_\u200b`;

    const node = this._doc.createComment(token);

    const parentElement = (0, _nullthrows.default)(el.parentElement);

    if (position === 'before') {
      parentElement.insertBefore(node, el);
    } else if (position === 'after') {
      parentElement.insertBefore(node, el.nextSibling);
    } else {
      throw new Error(`Invalid position ${position}`);
    }

    this._htmls.set('<!--' + token + '-->', html);

    return this;
  }

}

exports.default = HTMLMutator;