#!/usr/bin/env node
'use strict';

/*
 * prosemirror_parser - single-file ProseMirror converter.
 *
 * Inputs:  html=<file> | md=<file> | json=<file> | doc=<file> [step=<file>]
 * Outputs: to=json | html | markdown (alias md)
 * Defaults: html=/md= -> json; json= -> html; doc= -> json (legacy wrapper).
 * Options:  out=<file>, encoding=<enc> (html), - for stdin, --help.
 */

const fs = require('fs');

// jsdom's XMLHttpRequest-impl calls require.resolve("./xhr-sync-worker.js") at
// import time; only used for sync XHR (unused here). In a bundle/pkg binary
// that file does not exist, so intercept that one resolution.
(function () {
  var __resolve = require.resolve;
  require.resolve = function (request, options) {
    if (typeof request === 'string' && request.indexOf('xhr-sync-worker.js') !== -1) {
      return 'xhr-sync-worker.js';
    }
    return __resolve.call(require, request, options);
  };
})();

const { JSDOM } = require('jsdom');
const pmModel = require('prosemirror-model');
const { Step } = require('prosemirror-transform');
const MarkdownIt = require('markdown-it');
const pmMd = require('prosemirror-markdown');

const schema = require('./dst/EditorSchema').default;

// Markdown serializer (JSON -> Markdown)
function buildMarkdownSerializer() {
  const nodes = Object.assign({}, pmMd.defaultMarkdownSerializer.nodes);
  const marks = Object.assign({}, pmMd.defaultMarkdownSerializer.marks);
  const serializerOptions = {
    escapeExtraCharacters: /[<>]/g,
    tightLists: true
  };

  nodes.heading = (state, node) => {
    const rawLevel = Number(node.attrs.level);
    const level = Number.isFinite(rawLevel)
      ? Math.min(6, Math.max(1, Math.floor(rawLevel)))
      : 1;
    state.write(state.repeat('#', level) + ' ');
    state.renderInline(node, false);
    state.closeBlock(node);
  };

  // Blockquotes in this schema hold inline content, so use renderInline
  // (renderContent would silently drop marks).
  nodes.blockquote = (state, node) => {
    state.wrapBlock('> ', null, node, () => state.renderInline(node));
  };

  nodes.ordered_list = (state, node) => {
    const rawStart = node.attrs.start == null ? 1 : Number(node.attrs.start);
    const start = Number.isFinite(rawStart) && rawStart >= 0
      ? Math.floor(rawStart)
      : 1;
    const maxW = String(start + node.childCount - 1).length;
    const space = state.repeat(' ', maxW + 2);
    state.renderList(node, space, i => {
      const nStr = String(start + i);
      return state.repeat(' ', maxW - nStr.length) + nStr + '. ';
    });
  };

  const escapeMarkdownUrl = url => String(url)
    .replace(/\\/g, '\\\\')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s/g, ch => encodeURIComponent(ch))
    .replace(/[\(\)"]/g, '\\$&');

  // The default image handler calls node.attrs.src.replace(...), which throws
  // when src is null (a valid default in this schema).
  nodes.image = (state, node) => {
    const src = node.attrs.src == null ? '' : String(node.attrs.src);
    const alt = node.attrs.alt == null ? '' : String(node.attrs.alt);
    const title = node.attrs.title == null ? '' : String(node.attrs.title);
    state.write(
      '![' + state.esc(alt) + '](' +
      escapeMarkdownUrl(src) +
      (title ? ' "' + title.replace(/"/g, '\\"') + '"' : '') +
      ')'
    );
  };

  nodes.math = (state, node) => {
    const latex = node.attrs.latex == null ? '' : String(node.attrs.latex);
    const escaped = latex.replace(/(^|[^\\])\$/g, (match, prefix) => prefix + '\\$');
    state.write('$' + escaped + '$');
  };
  nodes.bookmark = () => {};

  // GFM strikethrough is supported by the Markdown parser in this file.
  marks.strike = {
    open: '~~',
    close: '~~',
    mixable: true,
    expelEnclosingWhitespace: true
  };

  // These three marks have unambiguous HTML equivalents. The Markdown parser
  // below recognizes the same tags, so they survive a JSON -> Markdown -> JSON
  // round trip instead of being silently dropped.
  marks.underline = {
    open: '<u>',
    close: '</u>',
    mixable: true,
    expelEnclosingWhitespace: true
  };
  marks.super = {
    open: '<sup>',
    close: '</sup>',
    mixable: true,
    expelEnclosingWhitespace: true
  };
  marks.sub = {
    open: '<sub>',
    close: '</sub>',
    mixable: true,
    expelEnclosingWhitespace: true
  };
  marks['mark-no-break'] = {
    open: '<nobr>',
    close: '</nobr>',
    mixable: true,
    expelEnclosingWhitespace: true
  };

  // The default link handler calls mark.attrs.href.replace(...), which throws
  // when href is null (a valid default in this schema).
  const defaultLink = pmMd.defaultMarkdownSerializer.marks.link;
  marks.link = Object.assign({}, defaultLink, {
    open(state, mark, parent, index) {
      const href = mark.attrs.href == null ? '' : String(mark.attrs.href);
      defaultLink.open(state, mark, parent, index);
      if (/[\s<>]/.test(href)) state.inAutolink = false;
      return state.inAutolink ? '<' : '[';
    },
    close(state, mark, parent, index) {
      const inAutolink = state.inAutolink;
      state.inAutolink = undefined;
      if (inAutolink) return '>';
      const href = escapeMarkdownUrl(
        mark.attrs.href == null ? '' : mark.attrs.href
      );
      const title = mark.attrs.title == null ? null : String(mark.attrs.title);
      return '](' + href + (title ? ' "' + title.replace(/"/g, '\\"') + '"' : '') + ')';
    }
  });

  nodes.table = (state, node) => {
    const rows = [];
    let firstRowHasHeader = false;
    let rowIndex = 0;

    node.forEach(row => {
      const cells = [];
      row.forEach(cell => {
        cells.push(cell);
        if (rowIndex === 0 && cell.type.name === 'table_header') firstRowHasHeader = true;
      });
      rows.push(cells);
      rowIndex++;
    });

    if (!rows.length) { state.closeBlock(node); return; }

    // Markdown tables are rectangular: colspan expands the grid width.
    let colCount = 0;
    for (const cells of rows) {
      let width = 0;
      for (const cell of cells) width += Math.max(1, cell.attrs.colspan || 1);
      colCount = Math.max(colCount, width);
    }
    if (!colCount) { state.closeBlock(node); return; }

    // Serialize each block's inline content so marks, links, math, images,
    // and hard breaks are preserved instead of flattened by textContent.
    const cellText = cell => {
      const parts = [];
      cell.forEach(child => {
        if (child.isTextblock) {
          const cellState = new pmMd.MarkdownSerializerState(
            nodes,
            marks,
            serializerOptions
          );
          cellState.renderInline(child);
          const text = cellState.out
            .replace(/\\\n/g, ' ')
            .replace(/\n/g, ' ')
            .trim();
          if (text) parts.push(text);
        } else {
          // Non-textblocks (lists, nested tables, etc.) cannot be represented
          // inside a Markdown table cell. Flatten their textblocks with spaces.
          const blockParts = [];
          child.descendants(node => {
            if (node.isTextblock) {
              const text = node.textContent.trim();
              if (text) blockParts.push(text);
            }
          });
          const raw = blockParts.length ? blockParts.join(' ') : child.textContent;
          const text = raw
            .replace(/\\/g, '\\\\')
            .replace(/\|/g, '\\|')
            .replace(/</g, '\\<')
            .replace(/>/g, '\\>')
            .replace(/\n/g, ' ')
            .trim();
          if (text) parts.push(text);
        }
      });
      return parts.join(' ');
    };

    // Expand colspan/rowspan into a rectangular grid.
    const grid = [];
    const carry = new Array(colCount).fill(null);
    for (const cells of rows) {
      const outRow = new Array(colCount).fill('');
      const occupied = new Array(colCount).fill(false);

      // Cells continuing from a rowspan above.
      for (let c = 0; c < colCount; c++) {
        const entry = carry[c];
        if (entry && entry.remaining > 0) {
          occupied[c] = true;
          outRow[c] = entry.text;
          entry.remaining--;
          if (entry.remaining === 0) carry[c] = null;
        }
      }

      // Cells that start in this row.
      let cursor = 0;
      for (const cell of cells) {
        const colspan = Math.max(1, cell.attrs.colspan || 1);
        const rowspan = Math.max(1, cell.attrs.rowspan || 1);
        let start = -1;

        for (let c = cursor; c <= colCount - colspan; c++) {
          let free = true;
          for (let k = 0; k < colspan; k++) {
            if (occupied[c + k]) { free = false; break; }
          }
          if (free) { start = c; break; }
        }
        if (start < 0) continue;

        const text = cellText(cell);
        for (let k = 0; k < colspan; k++) {
          occupied[start + k] = true;
          outRow[start + k] = k === 0 ? text : '';
        }

        if (rowspan > 1) {
          for (let k = 0; k < colspan; k++) {
            carry[start + k] = { remaining: rowspan - 1, text: '' };
          }
        }
        cursor = start + colspan;
      }
      grid.push(outRow);
    }

    const esc = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ').trim();
    const line = cells => '| ' + Array.from({ length: colCount },
      (_, i) => esc(cells[i] || '')).join(' | ') + ' |';
    const separator = '| ' + Array.from({ length: colCount }, () => '---').join(' | ') + ' |';

    // GFM requires a header row. If the source has no <th>, emit an empty one.
    const header = firstRowHasHeader ? grid[0] : new Array(colCount).fill('');
    const dataRows = firstRowHasHeader ? grid.slice(1) : grid;

    const out = [line(header), separator];
    for (const r of dataRows) out.push(line(r));

    state.write(out.join('\n'));
    state.closeBlock(node);
  };

  for (const name of Object.keys(schema.nodes)) {
    if (!nodes[name]) {
      nodes[name] = (state, node) => {
        if (node.isText) state.text(node.text);
        else if (node.isInline) state.write(node.textContent);
        else state.renderContent(node);
      };
    }
  }
  for (const name of Object.keys(schema.marks)) {
    if (!marks[name]) marks[name] = { open: '', close: '' };
  }

  return new pmMd.MarkdownSerializer(nodes, marks, serializerOptions);
}
// Markdown parser (Markdown -> JSON)
function buildMarkdownParser() {
  const md = new MarkdownIt('default', { html: false });

  const MARK_TAGS = {
    u: 'underline',
    sup: 'super',
    sub: 'sub',
    nobr: 'mark-no-break'
  };
  md.inline.ruler.before('escape', 'mark_tag', (state, silent) => {
    const src = state.src;
    const pos = state.pos;
    if (src.charCodeAt(pos) !== 0x3c) return false; // '<'
    const match = /^<(\/?)(u|sup|sub|nobr)>/i.exec(src.slice(pos));
    if (!match) return false;
    if (!silent) {
      const token = state.push(
        match[1] ? 'mark_tag_close' : 'mark_tag_open',
        '',
        0
      );
      token.markName = MARK_TAGS[match[2].toLowerCase()];
    }
    state.pos += match[0].length;
    return true;
  });

  md.inline.ruler.before('escape', 'math_inline', (state, silent) => {
    const src = state.src;
    const pos = state.pos;
    if (src.charCodeAt(pos) !== 0x24) return false; // '$'
    let end = -1;
    for (let i = pos + 1; i < src.length; i++) {
      // Skip escaped characters so "\$" inside math is not treated as the
      // closing delimiter (the serializer emits it for literal dollar signs).
      if (src.charCodeAt(i) === 0x5c) { i++; continue; }
      if (src.charCodeAt(i) === 0x24 && i > pos + 1 && !/\s/.test(src[i - 1])) {
        end = i;
        break;
      }
    }
    if (end < 0) return false;
    const content = src.slice(pos + 1, end);
    if (!content || /^\s|\s$/.test(content)) return false;
    if (!silent) {
      const token = state.push('math', 'math', 0);
      token.content = content;
    }
    state.pos = end + 1;
    return true;
  });

  const tokens = {
    blockquote: { block: 'blockquote' },
    paragraph: { block: 'paragraph' },
    list_item: { block: 'list_item' },
    bullet_list: { block: 'bullet_list' },
    ordered_list: {
      block: 'ordered_list',
      getAttrs: tok => {
        const raw = tok.attrGet('start');
        const value = raw == null || raw === '' ? 1 : Number(raw);
        return {
          start: Number.isFinite(value) && value >= 0 ? Math.floor(value) : 1
        };
      }
    },
    heading: {
      block: 'heading',
      getAttrs: tok => ({ level: +tok.tag.slice(1) })
    },
    // The Licit schema has no code_block node, so fall back to a paragraph.
    fence: { block: 'paragraph', noCloseToken: true },
    code_block: { block: 'paragraph', noCloseToken: true },
    hr: { node: 'horizontal_rule' },
    image: {
      node: 'image',
      getAttrs: tok => ({
        src: tok.attrGet('src') || null,
        title: tok.attrGet('title') || null,
        alt: (tok.children && tok.children[0] && tok.children[0].content) || null
      })
    },
    hardbreak: { node: 'hard_break' },
    em: { mark: 'em' },
    strong: { mark: 'strong' },
    s: { mark: 'strike' },
    link: {
      mark: 'link',
      getAttrs: tok => ({ href: tok.attrGet('href'), title: tok.attrGet('title') || null })
    },
    code_inline: { mark: 'code' },
    math: { node: 'math', getAttrs: tok => ({ latex: tok.content, align: null }) },
    table: { block: 'table' },
    thead: { ignore: true },
    tbody: { ignore: true },
    tr: { block: 'table_row' }
  };

  const parser = new pmMd.MarkdownParser(schema, md, tokens);

  parser.tokenHandlers['mark_tag_open'] = (state, tok) => {
    const markType = schema.marks[tok.markName];
    if (markType) state.openMark(markType.create());
  };
  parser.tokenHandlers['mark_tag_close'] = (state, tok) => {
    const markType = schema.marks[tok.markName];
    if (markType) state.closeMark(markType);
  };

  // This schema's blockquote holds inline content, while Markdown blockquotes
  // contain paragraphs. Flatten those paragraph wrappers inside blockquotes.
  const paragraphOpen = parser.tokenHandlers['paragraph_open'];
  const paragraphClose = parser.tokenHandlers['paragraph_close'];
  parser.tokenHandlers['paragraph_open'] = (state, tok, toks, i) => {
    if (state.top().type === schema.nodes.blockquote) {
      if (state.top().content.length) state.addText(' ');
      return;
    }
    return paragraphOpen(state, tok, toks, i);
  };
  parser.tokenHandlers['paragraph_close'] = (state, tok, toks, i) => {
    if (state.top().type === schema.nodes.blockquote) return;
    return paragraphClose(state, tok, toks, i);
  };

  // Table cells have `block+` content, but Markdown cells are inline, so wrap
  // each cell's content in a paragraph.
  const th = schema.nodes.table_header;
  const td = schema.nodes.table_cell;
  const p = schema.nodes.paragraph;
  parser.tokenHandlers['th_open'] = state => { state.openNode(th); state.openNode(p); };
  parser.tokenHandlers['th_close'] = state => { state.closeNode(); state.closeNode(); };
  parser.tokenHandlers['td_open'] = state => { state.openNode(td); state.openNode(p); };
  parser.tokenHandlers['td_close'] = state => { state.closeNode(); state.closeNode(); };

  return parser;
}

const mdSerializer = buildMarkdownSerializer();
const mdParser = buildMarkdownParser();

function readRaw(path) {
  return path === '-' ? fs.readFileSync(0) : fs.readFileSync(path);
}
function readText(path) {
  return readRaw(path).toString('utf8').replace(/^\uFEFF/, '');
}
function decodeHtml(buf, forced) {
  if (forced && forced !== 'auto') return buf.toString(forced);
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) return buf.toString('utf16le');
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return buf.toString('utf8').replace(/^\uFEFF/, '');
  }
  const sample = buf.slice(0, 2048);
  let zeros = 0;
  for (let i = 0; i < sample.length; i++) if (sample[i] === 0) zeros++;
  if (sample.length > 0 && zeros / sample.length >= 0.2) return buf.toString('utf16le');
  return buf.toString('utf8');
}
function parseArgs(argv) {
  const options = {};
  for (const arg of argv) {
    const i = arg.indexOf('=');
    if (i > 0) options[arg.slice(0, i)] = arg.slice(i + 1);
    else if (arg === '-h' || arg === '--help' || arg === 'help') options.help = true;
    else options[arg] = true;
  }
  return options;
}
function emit(result, out) {
  if (out) fs.writeFileSync(out, result);
  else process.stdout.write(result.endsWith('\n') ? result : result + '\n');
}
function normalizeTo(to, kind) {
  if (to === 'md') to = 'markdown';
  if (to && ['json', 'html', 'markdown'].indexOf(to) !== -1) return to;
  if (kind === 'json') return 'html';
  if (kind === 'steps') return 'json';
  return 'json';
}
function htmlToDoc(html) {
  const { document } = new JSDOM(html).window;
  return pmModel.DOMParser.fromSchema(schema).parse(document, { preserveWhitespace: true });
}
function jsonToNode(jsonText) {
  const parsed = JSON.parse(jsonText);
  const nodeJson = parsed && parsed.type === 'doc' ? parsed
    : (parsed && parsed.doc_json) || parsed;
  const node = pmModel.Node.fromJSON(schema, nodeJson);
  if (node.type !== schema.nodes.doc) {
    throw new Error('Input JSON must contain a ProseMirror document node (type "doc")');
  }
  return node;
}
function markdownToDoc(mdText) {
  return mdParser.parse(mdText);
}
function docToHtml(node) {
  const { document } = new JSDOM('<!DOCTYPE html><div id="content"></div>').window;
  const target = document.querySelector('div');
  const serializer = pmModel.DOMSerializer.fromSchema(schema);

  const cleanStyle = style => {
    if (typeof style !== 'string') return style;
    return style
      // ParagraphNodeSpec omits the ';' between line-height and padding.
      .replace(/([^;])(padding-(?:top|bottom):)/g, '$1;$2')
      .replace(/;{2,}/g, ';')
      .replace(/^\s*;+/, '')
      .replace(/;\s*$/, '')
      .trim();
  };

  // ParagraphNodeSpec.toDOM ignores the paragraph color attr, and inserts
  // malformed CSS when lineSpacing and padding are both present.
  const repairParagraphSpec = (spec, paragraphNode) => {
    const attrs = spec[1] || (spec[1] = {});
    let style = cleanStyle(attrs.style);
    if (paragraphNode.attrs.color) {
      const color = 'color: ' + paragraphNode.attrs.color + ';';
      style = style ? style + '; ' + color : color;
    }
    if (style) attrs.style = style;
    else delete attrs.style;
    return spec;
  };

  const paragraphToDOM = schema.nodes.paragraph.spec.toDOM;
  serializer.nodes.paragraph = paragraphNode =>
    repairParagraphSpec(paragraphToDOM(paragraphNode), paragraphNode);

  const blockquoteToDOM = schema.nodes.blockquote.spec.toDOM;
  serializer.nodes.blockquote = blockquoteNode =>
    repairParagraphSpec(blockquoteToDOM(blockquoteNode), blockquoteNode);

  const headingToDOM = schema.nodes.heading.spec.toDOM;
  serializer.nodes.heading = headingNode => {
    const spec = repairParagraphSpec(headingToDOM(headingNode), headingNode);
    const rawLevel = Number(headingNode.attrs.level);
    const level = Number.isFinite(rawLevel)
      ? Math.min(6, Math.max(1, Math.floor(rawLevel)))
      : 1;
    spec[0] = 'h' + level;
    return spec;
  };

  const orderedListToDOM = schema.nodes.ordered_list.spec.toDOM;
  serializer.nodes.ordered_list = listNode => {
    const rawStart = listNode.attrs.start == null ? 1 : Number(listNode.attrs.start);
    const start = Number.isFinite(rawStart) ? Math.floor(rawStart) : 1;
    const normalized = listNode.type.create(
      Object.assign({}, listNode.attrs, { start }),
      listNode.content,
      listNode.marks
    );
    return orderedListToDOM(normalized);
  };

  const normalizeTableSpec = spec => {
    const attrs = spec[1];
    if (attrs && typeof attrs.style === 'string') {
      const style = cleanStyle(attrs.style);
      if (style) attrs.style = style;
      else delete attrs.style;
    }
    return spec;
  };

  const tableToDOM = schema.nodes.table.spec.toDOM;
  const cellToDOM = schema.nodes.table_cell.spec.toDOM;
  const headerToDOM = schema.nodes.table_header.spec.toDOM;
  serializer.nodes.table = tableNode => normalizeTableSpec(tableToDOM(tableNode));
  serializer.nodes.table_cell = cellNode => normalizeTableSpec(cellToDOM(cellNode));
  serializer.nodes.table_header = cellNode => normalizeTableSpec(headerToDOM(cellNode));

  const horizontalRuleToDOM = schema.nodes.horizontal_rule.spec.toDOM;
  serializer.nodes.horizontal_rule = hrNode => {
    const spec = horizontalRuleToDOM(hrNode);
    if (hrNode.attrs.pageBreak) {
      const attrs = spec[1] || (spec[1] = {});
      attrs.style = 'page-break-before: always; break-before: page;' +
        (attrs.style ? ' ' + attrs.style : '');
    }
    return spec;
  };

  // MathNodeSpec.toDOM intentionally renders an empty span because the editor
  // uses a NodeView. For a standalone HTML export, include the LaTeX as text.
  serializer.nodes.math = mathNode => {
    const latex = mathNode.attrs.latex == null ? '' : String(mathNode.attrs.latex);
    const span = document.createElement('span');
    span.setAttribute('data-latex', latex);
    if (mathNode.attrs.align) {
      span.setAttribute('align', String(mathNode.attrs.align));
    }
    span.textContent = latex;
    return span;
  };

  // ImageNodeSpec.toDOM passes the crop object straight through, which the DOM
  // serializer stringifies as "[object Object]". Only emit real attributes.
  serializer.nodes.image = imageNode => {
    const attrs = imageNode.attrs;
    const img = document.createElement('img');
    img.setAttribute('alt', attrs.alt == null ? '' : String(attrs.alt));
    if (attrs.src != null) img.setAttribute('src', String(attrs.src));
    if (attrs.title) img.setAttribute('title', String(attrs.title));
    if (attrs.width != null) img.setAttribute('width', String(attrs.width));
    if (attrs.height != null) img.setAttribute('height', String(attrs.height));
    if (attrs.align) {
      if (attrs.align === 'block') {
        img.style.display = 'block';
      } else {
        img.setAttribute('align', String(attrs.align));
        if (attrs.align === 'left' || attrs.align === 'right') {
          img.style.float = attrs.align;
        } else if (attrs.align === 'center') {
          img.style.display = 'block';
          img.style.marginLeft = 'auto';
          img.style.marginRight = 'auto';
        }
      }
    }
    if (attrs.objectId != null) img.setAttribute('objectId', String(attrs.objectId));
    if (attrs.rotate != null) {
      img.style.transform = 'rotate(' + attrs.rotate + 'rad)';
    }
    if (attrs.crop && typeof attrs.crop === 'object') {
      img.setAttribute('data-crop', JSON.stringify(attrs.crop));
    }
    return img;
  };

  serializer.serializeFragment(node.content, {
    document: document
  }, target);
  return target.innerHTML;
}
function docToMarkdown(node) {
  const result = mdSerializer.serialize(node);
  return result.endsWith('\n') ? result : result + '\n';
}
function docToJson(node) {
  return JSON.stringify(node.toJSON());
}
function nodeToOutput(node, to) {
  if (to === 'html') return docToHtml(node);
  if (to === 'markdown') return docToMarkdown(node);
  return docToJson(node);
}
function applySteps(docPath, stepPath) {
  const docJson = JSON.parse(readText(docPath));
  let docNode = schema.nodeFromJSON(docJson['doc_json']);
  const stepLines = readText(stepPath).split('\n').filter(Boolean);
  let attrs = docNode['attrs'];
  for (const line of stepLines) {
    const parsed = JSON.parse(line);
    for (const step of parsed['steps']) {
      if (step['stepType'] === 'SetDocAttr') {
        attrs[step['key']] = step['value'];
      } else {
        const result = Step.fromJSON(schema, step).apply(docNode);
        if (!result.failed) docNode = result.doc;
      }
    }
  }
  docNode['attrs'] = attrs;
  return { docJson, docNode };
}
const HELP = [
  'prosemirror_parser - single-file ProseMirror converter.',
  '',
  'Inputs (key=value):',
  '  html=<file>  HTML input         md=<file>   Markdown input',
  '  json=<file>  document JSON      doc=<file>  wrapped JSON (+ step=<file>)',
  '',
  'Outputs (to=json | html | markdown; md is an alias):',
  '  json         ProseMirror document JSON',
  '  html         serialized HTML fragment',
  '  markdown     CommonMark/GFM markdown',
  '',
  'Defaults: html=/md= -> json; json= -> html; no arguments -> steps mode',
  '          (doc=data/doc.txt step=data/step.txt out=data/out.txt).',
  'Options: out=<file> (default stdout; doc= defaults to data/out.txt),',
  '         encoding=<enc> for html=, --help, and - for stdin.',
  '',
  'Legacy service= interface (file to file, defaults in parens):',
  '  service=html2json  html=  -> json=   (data/html.txt -> data/json.txt)',
  '  service=json2html  json=  -> html=   (data/json.txt -> data/html.txt)',
  '',
  'Examples:',
  '  prosemirror_parser html=data/html.txt out=data/doc.json',
  '  prosemirror_parser json=data/doc.json to=markdown out=data/out.md',
  '  prosemirror_parser md=data/out.md to=json out=data/doc.json',
  '  prosemirror_parser doc=data/doc.txt step=data/step.txt out=data/out.txt'
].join('\n');

function usage() {
  process.stdout.write(HELP + '\n');
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) { usage(); return; }

  const knownOptions = [
    'html', 'md', 'markdown', 'json', 'doc', 'step',
    'to', 'out', 'encoding', 'service', 'help'
  ];
  for (const key of Object.keys(options)) {
    if (knownOptions.indexOf(key) === -1) {
      throw new Error('Unknown argument "' + key + '".');
    }
  }
  const valueOptions = [
    'html', 'md', 'markdown', 'json', 'doc', 'step',
    'to', 'out', 'encoding', 'service'
  ];
  for (const key of valueOptions) {
    if (options[key] === true) {
      throw new Error('Missing value for "' + key + '"; use ' + key + '=<value>.');
    }
  }

  if (typeof options.to === 'string') {
    options.to = options.to.toLowerCase();
  }
  if (options.to != null && options.to !== '' &&
      ['json', 'html', 'markdown', 'md'].indexOf(options.to) === -1) {
    throw new Error(
      'Invalid to= value "' + options.to +
      '"; expected json, html, markdown, or md.'
    );
  }
  if (options.service != null &&
      options.service !== 'json2html' && options.service !== 'html2json') {
    throw new Error(
      'Invalid service= value "' + options.service +
      '"; expected json2html or html2json. Use to=markdown for Markdown output.'
    );
  }

  // Legacy `service=` interface (identical to the original main.js):
  //   service=html2json  reads html= (data/html.txt)  writes json= (data/json.txt)
  //   service=json2html  reads json= (data/json.txt)  writes html= (data/html.txt)
  if (options.service === 'json2html') {
    const jsonPath = options.json || 'data/json.txt';
    const htmlPath = options.html || 'data/html.txt';
    const node = jsonToNode(readText(jsonPath));
    const { document } = new JSDOM('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>').window;
    document.body.innerHTML = docToHtml(node);
    fs.writeFileSync(htmlPath, '<!DOCTYPE html>' + document.documentElement.outerHTML);
    return;
  }
  if (options.service === 'html2json') {
    const htmlPath = options.html || 'data/html.txt';
    const jsonPath = options.json || 'data/json.txt';
    const doc = htmlToDoc(decodeHtml(readRaw(htmlPath), options.encoding));
    fs.writeFileSync(jsonPath, JSON.stringify(doc.toJSON()));
    return;
  }

  let out = options.out;
  let result;

  const hasInput = options.doc || options.json || options.md || options.markdown || options.html;
  if (options.doc || !hasInput) {
    // steps -> merged document (legacy main.js behavior; also the no-argument default)
    const docPath = options.doc || 'data/doc.txt';
    const stepPath = options.step || 'data/step.txt';
    if (!out) out = 'data/out.txt';
    const to = normalizeTo(options.to, 'steps');
    const { docJson, docNode } = applySteps(docPath, stepPath);
    if (to === 'json') {
      docJson['doc_json'] = docNode;
      result = JSON.stringify(docJson);
    } else {
      result = nodeToOutput(docNode, to);
    }
  } else if (options.json) {
    const to = normalizeTo(options.to, 'json');
    result = nodeToOutput(jsonToNode(readText(options.json)), to);
  } else if (options.md || options.markdown) {
    const to = normalizeTo(options.to, 'md');
    result = nodeToOutput(markdownToDoc(readText(options.md || options.markdown)), to);
  } else {
    // HTML -> ... (legacy default: data/html.txt)
    const htmlPath = options.html || 'data/html.txt';
    const to = normalizeTo(options.to, 'html');
    result = nodeToOutput(htmlToDoc(decodeHtml(readRaw(htmlPath), options.encoding)), to);
  }

  emit(result, out);
}

try {
  main();
} catch (err) {
  console.error(err && err.stack ? err.stack : String(err));
  process.exitCode = 1;
}



