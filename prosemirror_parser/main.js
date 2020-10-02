"use strict";

var _EditorSchema = _interopRequireDefault(require("./dst/EditorSchema"));
const {readFileSync, writeFile} = require('fs');
var _prosemirrorTransform = require("prosemirror-transform");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


// parse in paths of documents
var args = process.argv
var options = {}
for (var arg of args) {
  arg = arg.split('=')
  if (arg[0] && arg[1]) {
    options[arg[0]] = arg[1]
  }
}

if (!options['doc']) {
  options['doc'] = 'data/doc.txt'
  // process.exit(-1)
}
if (!options['step']) {
  options['step'] = 'data/step.txt'
  // process.exit(-1)
}

if (!options['out']) {
  options['out'] = 'data/out.txt'
  // process.exit(-1)
}

var custom_schema = _EditorSchema.default

var doc_json = readFileSync(options['doc'], () => { null })
var doc_json = JSON.parse(doc_json)

var doc_node = custom_schema.nodeFromJSON(doc_json['doc_json'])

var step_jsons = readFileSync(options['step'], () => { null })
var step_jsons = step_jsons.toString().split('\n').filter(Boolean)

var attrs = doc_node['attrs']

for (var step_json of step_jsons) {
  step_json = JSON.parse(step_json)
  for (var step of step_json['steps']) {
    // change the page width with SetDocAttr
    if (step['stepType'] == 'SetDocAttr') {
      attrs[step['key']] = step['value']
    } else {
      var step = _prosemirrorTransform.Step.fromJSON(custom_schema, step)
      var result = step.apply(doc_node)
      if (result.failed) {

      } else {
        doc_node = result.doc
      }
    }
  }
}

doc_node['attrs'] = attrs

doc_json['doc_json'] = doc_node

writeFile(options['out'], JSON.stringify(doc_json), () => { null }  )
