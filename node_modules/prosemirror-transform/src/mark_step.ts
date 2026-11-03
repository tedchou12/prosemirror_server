import {Fragment, Slice, Node, Mark, Schema} from "prosemirror-model"
import {Step, StepResult} from "./step"
import {Mappable} from "./map"

function mapFragment(fragment: Fragment, f: (child: Node, parent: Node, i: number) => Node, parent: Node): Fragment {
  let mapped = []
  for (let i = 0; i < fragment.childCount; i++) {
    let child = fragment.child(i)
    if (child.content.size) child = child.copy(mapFragment(child.content, f, child))
    if (child.isInline) child = f(child, parent, i)
    mapped.push(child)
  }
  return Fragment.fromArray(mapped)
}

/// Add a mark to all inline content between two positions.
export class AddMarkStep extends Step {
  /// Create a mark step.
  constructor(
    /// The start of the marked range.
    readonly from: number,
    /// The end of the marked range.
    readonly to: number,
    /// The mark to add.
    readonly mark: Mark
  ) {
    super()
  }

  apply(doc: Node) {
    let oldSlice = doc.slice(this.from, this.to), $from = doc.resolve(this.from)
    let parent = $from.node($from.sharedDepth(this.to))
    let slice = new Slice(mapFragment(oldSlice.content, (node, parent) => {
      if (!node.isAtom || !parent.type.allowsMarkType(this.mark.type)) return node
      return node.mark(this.mark.addToSet(node.marks))
    }, parent), oldSlice.openStart, oldSlice.openEnd)
    return StepResult.fromReplace(doc, this.from, this.to, slice)
  }

  invert(doc: Node): Step {
    let steps: (RemoveMarkStep | AddMarkStep)[] = []
    doc.nodesBetween(this.from, this.to, (node, pos) => {
      if (node.isInline && node.isAtom) {
        let added = this.mark.addToSet(node.marks)
        if (!Mark.sameSet(added, node.marks)) {
          let from = Math.max(this.from, pos), to = Math.min(this.to, pos + node.nodeSize)
          pushMarkStep(RemoveMarkStep, from, to, this.mark, steps)
          for (let mark of node.marks) if (!mark.isInSet(added))
            pushMarkStep(AddMarkStep, from, to, mark, steps)
        }
      }
    })
    return steps.length == 1 ? steps[0] : new MarkSetStep(steps)
  }

  map(mapping: Mappable): Step | null {
    let from = mapping.map(this.from, 1), to = mapping.map(this.to, -1)
    if (from >= to) return null
    return new AddMarkStep(from, to, this.mark)
  }

  merge(other: Step): Step | null {
    if (other instanceof AddMarkStep &&
        other.mark.eq(this.mark) &&
        this.from <= other.to && this.to >= other.from)
      return new AddMarkStep(Math.min(this.from, other.from),
                             Math.max(this.to, other.to), this.mark)
    return null
  }

  toJSON(): any {
    return {stepType: "addMark", mark: this.mark.toJSON(),
            from: this.from, to: this.to}
  }

  /// @internal
  static fromJSON(schema: Schema, json: any) {
    if (typeof json.from != "number" || typeof json.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON")
    return new AddMarkStep(json.from, json.to, schema.markFromJSON(json.mark))
  }
}

Step.jsonID("addMark", AddMarkStep)

/// Remove a mark from all inline content between two positions.
export class RemoveMarkStep extends Step {
  /// Create a mark-removing step.
  constructor(
    /// The start of the unmarked range.
    readonly from: number,
    /// The end of the unmarked range.
    readonly to: number,
    /// The mark to remove.
    readonly mark: Mark
  ) {
    super()
  }

  apply(doc: Node) {
    let oldSlice = doc.slice(this.from, this.to)
    let slice = new Slice(mapFragment(oldSlice.content, node => {
      return node.mark(this.mark.removeFromSet(node.marks))
    }, doc), oldSlice.openStart, oldSlice.openEnd)
    return StepResult.fromReplace(doc, this.from, this.to, slice)
  }

  invert(doc: Node): Step {
    let steps: (AddMarkStep | RemoveMarkStep)[] = []
    doc.nodesBetween(this.from, this.to, (node, pos) => {
      if (node.isInline && node.isAtom && this.mark.isInSet(node.marks))
        pushMarkStep(AddMarkStep, Math.max(this.from, pos), Math.min(this.to, pos + node.nodeSize), this.mark, steps)
    })
    return steps.length == 1 ? steps[0] : new MarkSetStep(steps)
  }

  map(mapping: Mappable): Step | null {
    let from = mapping.map(this.from, 1), to = mapping.map(this.to, -1)
    if (from >= to) return null
    return new RemoveMarkStep(from, to, this.mark)
  }

  merge(other: Step): Step | null {
    if (other instanceof RemoveMarkStep &&
        other.mark.eq(this.mark) &&
        this.from <= other.to && this.to >= other.from)
      return new RemoveMarkStep(Math.min(this.from, other.from),
                                Math.max(this.to, other.to), this.mark)
    return null
  }

  toJSON(): any {
    return {stepType: "removeMark", mark: this.mark.toJSON(),
            from: this.from, to: this.to}
  }

  /// @internal
  static fromJSON(schema: Schema, json: any) {
    if (typeof json.from != "number" || typeof json.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON")
    return new RemoveMarkStep(json.from, json.to, schema.markFromJSON(json.mark))
  }
}

Step.jsonID("removeMark", RemoveMarkStep)

export function pushMarkStep(
  cls: typeof AddMarkStep | typeof RemoveMarkStep,
  from: number, to: number, mark: Mark,
  target: (AddMarkStep | RemoveMarkStep)[]) {
  let last = target.length ? target[target.length - 1] : null
  if (last && last instanceof cls && last.to == from && last.mark.eq(mark)) {
    target[target.length - 1] = new cls(last.from, to, mark)
  } else {
    target.push(new cls(from, to, mark))
  }
}

class MarkSetStep extends Step {
  constructor(
    readonly steps: readonly (AddMarkStep | RemoveMarkStep)[]
  ) {
    super()
  }

  apply(doc: Node) {
    for (let step of this.steps) {
      let result = step.apply(doc)
      if (!result.doc) return result
      doc = result.doc
    }
    return new StepResult(doc, null)
  }

  invert(doc: Node): Step {
    return new MarkSetStep(this.steps.map(s => s.invert(doc) as AddMarkStep | RemoveMarkStep))
  }

  map(mapping: Mappable) {
    let result: (AddMarkStep | RemoveMarkStep)[] = []
    for (let step of this.steps) {
      let mapped = step.map(mapping)
      if (mapped) result.push(mapped as AddMarkStep | RemoveMarkStep)
    }
    return result.length ? new MarkSetStep(result) : null
  }

  toJSON() {
    return {stepType: "markSet", steps: this.steps.map(s => s.toJSON())}
  }

  static fromJSON(schema: Schema, json: any) {
    if (!Array.isArray(json.steps) || !json.steps.every((s: any) => s.stepType == "addMark" || s.stepType == "removeMark"))
      throw new RangeError("Invalid JSON for MarkSetStep")
    return new MarkSetStep(json.steps.map((s: any) => Step.fromJSON(schema, s)))
  }
}

Step.jsonID("markSet", MarkSetStep)

/// Add a mark to a specific node.
export class AddNodeMarkStep extends Step {
  /// Create a node mark step.
  constructor(
    /// The position of the target node.
    readonly pos: number,
    /// The mark to add.
    readonly mark: Mark
  ) {
    super()
  }

  apply(doc: Node) {
    let node = doc.nodeAt(this.pos)
    if (!node) return StepResult.fail("No node at mark step's position")
    let updated = node.type.create(node.attrs, null, this.mark.addToSet(node.marks))
    return StepResult.fromReplace(doc, this.pos, this.pos + 1, new Slice(Fragment.from(updated), 0, node.isLeaf ? 0 : 1))
  }

  invert(doc: Node): Step {
    let node = doc.nodeAt(this.pos)
    if (node) {
      let newSet = this.mark.addToSet(node.marks)
      if (newSet.length == node.marks.length) {
        for (let i = 0; i < node.marks.length; i++)
          if (!node.marks[i].isInSet(newSet))
            return new AddNodeMarkStep(this.pos, node.marks[i])
        return new AddNodeMarkStep(this.pos, this.mark)
      }
    }
    return new RemoveNodeMarkStep(this.pos, this.mark)
  }

  map(mapping: Mappable): Step | null {
    let pos = mapping.mapResult(this.pos, 1)
    return pos.deletedAfter ? null : new AddNodeMarkStep(pos.pos, this.mark)
  }

  toJSON(): any {
    return {stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON()}
  }

  /// @internal
  static fromJSON(schema: Schema, json: any) {
    if (typeof json.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON")
    return new AddNodeMarkStep(json.pos, schema.markFromJSON(json.mark))
  }
}

Step.jsonID("addNodeMark", AddNodeMarkStep)

/// Remove a mark from a specific node.
export class RemoveNodeMarkStep extends Step {
  /// Create a mark-removing step.
  constructor(
    /// The position of the target node.
    readonly pos: number,
    /// The mark to remove.
    readonly mark: Mark
  ) {
    super()
  }

  apply(doc: Node) {
    let node = doc.nodeAt(this.pos)
    if (!node) return StepResult.fail("No node at mark step's position")
    let updated = node.type.create(node.attrs, null, this.mark.removeFromSet(node.marks))
    return StepResult.fromReplace(doc, this.pos, this.pos + 1, new Slice(Fragment.from(updated), 0, node.isLeaf ? 0 : 1))
  }

  invert(doc: Node): Step {
    let node = doc.nodeAt(this.pos)
    if (!node || !this.mark.isInSet(node.marks)) return this
    return new AddNodeMarkStep(this.pos, this.mark)
  }

  map(mapping: Mappable): Step | null {
    let pos = mapping.mapResult(this.pos, 1)
    return pos.deletedAfter ? null : new RemoveNodeMarkStep(pos.pos, this.mark)
  }

  toJSON(): any {
    return {stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON()}
  }

  /// @internal
  static fromJSON(schema: Schema, json: any) {
    if (typeof json.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON")
    return new RemoveNodeMarkStep(json.pos, schema.markFromJSON(json.mark))
  }
}

Step.jsonID("removeNodeMark", RemoveNodeMarkStep)
