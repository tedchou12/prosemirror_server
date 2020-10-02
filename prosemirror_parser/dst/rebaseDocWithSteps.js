"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rebaseDocWithSteps;

var _prosemirrorTransform = require("prosemirror-transform");

var _EditorSchema = _interopRequireDefault(require("./EditorSchema"));

var _SetDocAttrStep = _interopRequireDefault(require("./SetDocAttrStep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// [FS-AFQ][13-MAR-2020][IRAD-899]
// This is Capcomode. Shared Step, so that capcomode can be dealt collaboratively.
function rebaseDocWithSteps(clientID, docJSON, stepsJSON) {
  return new Promise((resolve, reject) => {
    // TODO: Move this into a separate server request.
    let docNode = _EditorSchema.default.nodeFromJSON(docJSON);

    const steps = stepsJSON.map(step => {
      const result = _prosemirrorTransform.Step.fromJSON(_EditorSchema.default, step);

      result.clientID = clientID;
      return result;
    });
    steps.forEach(step => {
      const result = step.apply(docNode);
      docNode = result.doc;
    });
    const newDocJSON = docNode.toJSON();
    const newStepsJSON = steps.map(step => {
      return step.toJSON();
    });
    resolve({
      docJSON: newDocJSON,
      stepsJSON: newStepsJSON
    });
  });
}