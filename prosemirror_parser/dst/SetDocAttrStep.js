"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorTransform = require("prosemirror-transform");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// https://discuss.prosemirror.net/t/changing-doc-attrs/784/17
class SetDocAttrStep extends _prosemirrorTransform.Step {
  constructor(key, value, stepType = 'SetDocAttr') {
    super();

    _defineProperty(this, "key", void 0);

    _defineProperty(this, "stepType", void 0);

    _defineProperty(this, "value", void 0);

    this.stepType = stepType;
    this.key = key;
    this.value = value;
  }

  apply(doc) {
    this.prevValue = doc.attrs[this.key];
    const attrs = { ...doc.attrs,
      [this.key]: this.value
    };
    const docNew = doc.type.create(attrs, doc.content, doc.marks);
    return _prosemirrorTransform.StepResult.ok(docNew);
  }

  invert() {
    return new SetDocAttrStep(this.key, this.prevValue, 'revertSetDocAttr');
  } // [FS] IRAD-1010 2020-07-27
  // Handle map properly so that undo works correctly for document attritube changes.  


  map(mapping) {
    var from = mapping.mapResult(this.from, 1),
        to = mapping.mapResult(this.to, -1);

    if (from.deleted && to.deleted) {
      return null;
    }

    return new SetDocAttrStep(this.key, this.value, 'SetDocAttr');
  }

  merge(other) {
    if (other instanceof SetDocAttrStep && other.mark.eq(this.mark) && this.from <= other.to && this.to >= other.from) {
      return new SetDocAttrStep(this.key, this.value, 'SetDocAttr');
    }
  }

  toJSON() {
    return {
      stepType: this.stepType,
      key: this.key,
      value: this.value
    };
  }

  static fromJSON(schema, json) {
    return new SetDocAttrStep(json.key, json.value, json.stepType);
  }

} // [FS-AFQ][13-MAR-2020][IRAD-899]
// Register this step so that capcomode can be dealt collaboratively.


_prosemirrorTransform.Step.jsonID("SetDocAttr", SetDocAttrStep);

var _default = SetDocAttrStep;
exports.default = _default;