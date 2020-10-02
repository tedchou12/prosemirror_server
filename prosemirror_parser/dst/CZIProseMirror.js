"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registeryKeys = registeryKeys;
exports.exportJSON = exportJSON;
exports.registerEditorView = registerEditorView;
exports.releaseEditorView = releaseEditorView;
exports.findEditorView = findEditorView;
exports.executeCommand = executeCommand;
exports.registerCommand = registerCommand;

var _prosemirrorView = require("prosemirror-view");

var _convertToJSON = _interopRequireDefault(require("./convertToJSON"));

var _CustomEditorView = _interopRequireDefault(require("./ui/CustomEditorView"));

var _UICommand = _interopRequireDefault(require("./ui/UICommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const commandsRegistery = new Map();
const viewsRegistery = new Map(); // This file exports methods to help developer to debug editor from web
// inspector. To use this, add the following lines to export the utility.
//
//   import * as CZIProseMirror from 'czi-prosemirror/dist/CZIProseMirror';
//   window.CZIProseMirror = CZIProseMirror;

function registeryKeys() {
  return Array.from(viewsRegistery.keys());
}

function exportJSON(id) {
  if (!id && viewsRegistery.size) {
    id = registeryKeys()[0];
    console.log(`use default editor id "${id}"`);
  }

  const view = viewsRegistery.get(String(id));

  if (!view) {
    throw new Error('view ${id} does not exist');
  }

  return (0, _convertToJSON.default)(view.state);
}

function registerEditorView(id, view) {
  if (viewsRegistery.has(id)) {
    throw new Error('view ${id} already registered');
  }

  if (!(view instanceof _CustomEditorView.default)) {
    throw new Error(`invalid view ${id}`);
  }

  if (!id) {
    throw new Error('id is required');
  }

  viewsRegistery.set(id, view);
}

function releaseEditorView(id) {
  if (!viewsRegistery.has(id)) {
    throw new Error('view ${id} was released');
  }

  viewsRegistery.delete(id);
}

function findEditorView(id) {
  return viewsRegistery.get(id) || null;
}

function executeCommand(name, viewID) {
  const command = commandsRegistery.get(name);

  if (command) {
    const view = viewID ? viewsRegistery.get(viewID) : Array.from(viewsRegistery.values())[0];

    if (view) {
      try {
        return command.execute(view.state, view.dispatch, view, null);
      } catch (ex) {
        console.warn(ex);
        return false;
      }
    }
  }

  return false;
}

function registerCommand(name, command) {
  if (!(command instanceof _UICommand.default)) {
    throw new Error(`invalid command ${name}`);
  }

  if (!name) {
    throw new Error('invalid command name');
  }

  if (commandsRegistery.has(name)) {
    throw new Error('command ${name} already registered');
  }

  commandsRegistery.set(name, command);
}