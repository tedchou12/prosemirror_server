var ref = require("./fragment");
var Fragment = ref.Fragment;
var ref$1 = require("./mark");
var Mark = ref$1.Mark;

var ContentExpr = function(nodeType, elements, inlineContent) {
  this.nodeType = nodeType
  this.elements = elements
  this.inlineContent = inlineContent
};

var prototypeAccessors = { isLeaf: {} };

prototypeAccessors.isLeaf.get = function () {
  return this.elements.length == 0
};

// : (?Object) → ContentMatch
// The content match at the start of this expression.
ContentExpr.prototype.start = function (attrs) {
  return new ContentMatch(this, attrs, 0, 0)
};

// : (NodeType, ?Object, ?Object) → ?ContentMatch
// Try to find a match that matches the given node, anywhere in the
// expression. (Useful when synthesizing a match for a node that's
// open to the left.)
ContentExpr.prototype.atType = function (parentAttrs, type, attrs, marks) {
    var this$1 = this;
    if ( marks === void 0 ) marks = Mark.none;

  for (var i = 0; i < this.elements.length; i++)
    { if (this$1.elements[i].matchesType(type, attrs, marks, parentAttrs, this$1))
      { return new ContentMatch(this$1, parentAttrs, i, 0) } }
};

ContentExpr.prototype.matches = function (attrs, fragment, from, to) {
  return this.start(attrs).matchToEnd(fragment, from, to)
};

// Get a position in a known-valid fragment. If this is a simple
// (single-element) expression, we don't have to do any matching,
// and can simply skip to the position with count `index`.
ContentExpr.prototype.getMatchAt = function (attrs, fragment, index) {
    if ( index === void 0 ) index = fragment.childCount;

  if (this.elements.length == 1)
    { return new ContentMatch(this, attrs, 0, index) }
  else
    { return this.start(attrs).matchFragment(fragment, 0, index) }
};

ContentExpr.prototype.checkReplace = function (attrs, content, from, to, replacement, start, end) {
    var this$1 = this;
    if ( replacement === void 0 ) replacement = Fragment.empty;
    if ( start === void 0 ) start = 0;
    if ( end === void 0 ) end = replacement.childCount;

  // Check for simple case, where the expression only has a single element
  // (Optimization to avoid matching more than we need)
  if (this.elements.length == 1) {
    var elt = this.elements[0]
    if (!checkCount(elt, content.childCount - (to - from) + (end - start), attrs, this)) { return false }
    for (var i = start; i < end; i++) { if (!elt.matches(replacement.child(i), attrs, this$1)) { return false } }
    return true
  }

  var match = this.getMatchAt(attrs, content, from).matchFragment(replacement, start, end)
  return match ? match.matchToEnd(content, to) : false
};

ContentExpr.prototype.checkReplaceWith = function (attrs, content, from, to, type, typeAttrs, marks) {
  if (this.elements.length == 1) {
    var elt = this.elements[0]
    if (!checkCount(elt, content.childCount - (to - from) + 1, attrs, this)) { return false }
    return elt.matchesType(type, typeAttrs, marks, attrs, this)
  }

  var match = this.getMatchAt(attrs, content, from).matchType(type, typeAttrs, marks)
  return match ? match.matchToEnd(content, to) : false
};

ContentExpr.prototype.compatible = function (other) {
    var this$1 = this;

  for (var i = 0; i < this.elements.length; i++) {
    var elt = this$1.elements[i]
    for (var j = 0; j < other.elements.length; j++)
      { if (other.elements[j].compatible(elt)) { return true } }
  }
  return false
};

ContentExpr.prototype.generateContent = function (attrs) {
  return this.start(attrs).fillBefore(Fragment.empty, true)
};

ContentExpr.parse = function (nodeType, expr) {
    var this$1 = this;

  var elements = [], pos = 0, inline = null
  for (;;) {
    pos += /^\s*/.exec(expr.slice(pos))[0].length
    if (pos == expr.length) { break }

    var types = /^(?:(\w+)|\(\s*(\w+(?:\s*\|\s*\w+)*)\s*\))/.exec(expr.slice(pos))
    if (!types) { throw new SyntaxError("Invalid content expression '" + expr + "' at " + pos) }
    pos += types[0].length
    var attrs = /^\[([^\]]+)\]/.exec(expr.slice(pos))
    if (attrs) { pos += attrs[0].length }
    var marks = /^<(?:(_)|\s*(\w+(?:\s+\w+)*)\s*)>/.exec(expr.slice(pos))
    if (marks) { pos += marks[0].length }
    var repeat = /^(?:([+*?])|\{\s*(\d+|\.\w+)\s*(,\s*(\d+|\.\w+)?)?\s*\})/.exec(expr.slice(pos))
    if (repeat) { pos += repeat[0].length }

    var nodeTypes = expandTypes(nodeType.schema, types[1] ? [types[1]] : types[2].split(/\s*\|\s*/))
    for (var i = 0; i < nodeTypes.length; i++) {
      if (inline == null) { inline = nodeTypes[i].isInline }
      else if (inline != nodeTypes[i].isInline) { throw new SyntaxError("Mixing inline and block content in a single node") }
    }
    var attrSet = !attrs ? null : parseAttrs(nodeType, attrs[1])
    var markSet = !marks ? false : marks[1] ? true : this$1.gatherMarks(nodeType.schema, marks[2].split(/\s+/))
    var ref = parseRepeat(nodeType, repeat);
      var min = ref.min;
      var max = ref.max;
    if (min != 0 && (nodeTypes[0].hasRequiredAttrs(attrSet) || nodeTypes[0].isText))
      { throw new SyntaxError("Node type " + types[0] + " in type " + nodeType.name +
                            " is required, but has non-optional attributes") }
    var newElt = new ContentElement(nodeTypes, attrSet, markSet, min, max)
    for (var i$1 = elements.length - 1; i$1 >= 0; i$1--) {
      var prev = elements[i$1]
      if (prev.min != prev.max && prev.overlaps(newElt))
        { throw new SyntaxError("Possibly ambiguous overlapping adjacent content expressions in '" + expr + "'") }
      if (prev.min != 0) { break }
    }
    elements.push(newElt)
  }

  return new ContentExpr(nodeType, elements, !!inline)
};

ContentExpr.gatherMarks = function (schema, marks) {
  var found = []
  for (var i = 0; i < marks.length; i++) {
    var name = marks[i], mark = schema.marks[name], ok = mark
    if (mark) {
      found.push(mark)
    } else {
      for (var prop in schema.marks) {
        var mark$1 = schema.marks[prop]
        if (name == "_" || (mark$1.spec.group && mark$1.spec.group.split(" ").indexOf(name) > -1))
          { found.push(ok = mark$1) }
      }
    }
    if (!ok) { throw new SyntaxError("Unknown mark type: '" + marks[i] + "'") }
  }
  return found
};

Object.defineProperties( ContentExpr.prototype, prototypeAccessors );
exports.ContentExpr = ContentExpr

var ContentElement = function(nodeTypes, attrs, marks, min, max) {
  this.nodeTypes = nodeTypes
  this.attrs = attrs
  this.marks = marks
  this.min = min
  this.max = max
};

ContentElement.prototype.matchesType = function (type, attrs, marks, parentAttrs, parentExpr) {
    var this$1 = this;

  if (this.nodeTypes.indexOf(type) == -1) { return false }
  if (this.attrs) {
    if (!attrs) { return false }
    for (var prop in this$1.attrs)
      { if (attrs[prop] != resolveValue(this$1.attrs[prop], parentAttrs, parentExpr)) { return false } }
  }
  if (this.marks === true) { return true }
  if (this.marks === false) { return marks.length == 0 }
  for (var i = 0; i < marks.length; i++)
    { if (this$1.marks.indexOf(marks[i].type) == -1) { return false } }
  return true
};

ContentElement.prototype.matches = function (node, parentAttrs, parentExpr) {
  return this.matchesType(node.type, node.attrs, node.marks, parentAttrs, parentExpr)
};

ContentElement.prototype.compatible = function (other) {
    var this$1 = this;

  for (var i = 0; i < this.nodeTypes.length; i++)
    { if (other.nodeTypes.indexOf(this$1.nodeTypes[i]) != -1) { return true } }
  return false
};

ContentElement.prototype.constrainedAttrs = function (parentAttrs, expr) {
    var this$1 = this;

  if (!this.attrs) { return null }
  var attrs = Object.create(null)
  for (var prop in this$1.attrs)
    { attrs[prop] = resolveValue(this$1.attrs[prop], parentAttrs, expr) }
  return attrs
};

ContentElement.prototype.createFiller = function (parentAttrs, expr) {
  var type = this.nodeTypes[0], attrs = type.computeAttrs(this.constrainedAttrs(parentAttrs, expr))
  return type.create(attrs, type.contentExpr.generateContent(attrs))
};

ContentElement.prototype.defaultType = function () {
  var first = this.nodeTypes[0]
  if (!(first.hasRequiredAttrs() || first.isText)) { return first }
};

ContentElement.prototype.overlaps = function (other) {
  return this.nodeTypes.some(function (t) { return other.nodeTypes.indexOf(t) > -1; })
};

ContentElement.prototype.allowsMark = function (markType) {
  return this.marks === true || this.marks && this.marks.indexOf(markType) > -1
};

// ::- Represents a partial match of a node type's [content
// expression](#model.NodeSpec), and can be used to find out whether further
// content matches here, and whether a given position is a valid end
// of the parent node.
var ContentMatch = function(expr, attrs, index, count) {
  this.expr = expr
  this.attrs = attrs
  this.index = index
  this.count = count
};

var prototypeAccessors$1 = { element: {},nextElement: {} };

prototypeAccessors$1.element.get = function () { return this.expr.elements[this.index] };

prototypeAccessors$1.nextElement.get = function () {
    var this$1 = this;

  for (var i = this.index, count = this.count; i < this.expr.elements.length; i++) {
    var element = this$1.expr.elements[i]
    if (this$1.resolveValue(element.max) > count) { return element }
    count = 0
  }
};

ContentMatch.prototype.move = function (index, count) {
  return new ContentMatch(this.expr, this.attrs, index, count)
};

ContentMatch.prototype.resolveValue = function (value) {
  return value instanceof AttrValue ? resolveValue(value, this.attrs, this.expr) : value
};

// :: (Node) → ?ContentMatch
// Match a node, returning a new match after the node if successful.
ContentMatch.prototype.matchNode = function (node) {
  return this.matchType(node.type, node.attrs, node.marks)
};

// :: (NodeType, ?Object, [Mark]) → ?ContentMatch
// Match a node type and marks, returning an match after that node
// if successful.
ContentMatch.prototype.matchType = function (type, attrs, marks) {
    var this$1 = this;
    if ( marks === void 0 ) marks = Mark.none;

  for (var ref = this, index = ref.index, count = ref.count; index < this.expr.elements.length; index++, count = 0) {
    var elt = this$1.expr.elements[index], max = this$1.resolveValue(elt.max)
    if (count < max && elt.matchesType(type, attrs, marks, this$1.attrs, this$1.expr)) {
      count++
      return this$1.move(index, count)
    }
    if (count < this$1.resolveValue(elt.min)) { return null }
  }
};

// :: (Fragment, ?number, ?number) → ?union<ContentMatch, bool>
// Try to match a fragment. Returns a new match when successful,
// `null` when it ran into a required element it couldn't fit, and
// `false` if it reached the end of the expression without
// matching all nodes.
ContentMatch.prototype.matchFragment = function (fragment, from, to) {
    var this$1 = this;
    if ( from === void 0 ) from = 0;
    if ( to === void 0 ) to = fragment.childCount;

  if (from == to) { return this }
  var fragPos = from, end = this.expr.elements.length
  for (var ref = this, index = ref.index, count = ref.count; index < end; index++, count = 0) {
    var elt = this$1.expr.elements[index], max = this$1.resolveValue(elt.max)

    while (count < max && fragPos < to) {
      if (elt.matches(fragment.child(fragPos), this$1.attrs, this$1.expr)) {
        count++
        if (++fragPos == to) { return this$1.move(index, count) }
      } else {
        break
      }
    }
    if (count < this$1.resolveValue(elt.min)) { return null }
  }
  return false
};

// :: (Fragment, ?number, ?number) → bool
// Returns true only if the fragment matches here, and reaches all
// the way to the end of the content expression.
ContentMatch.prototype.matchToEnd = function (fragment, start, end) {
  var matched = this.matchFragment(fragment, start, end)
  return matched && matched.validEnd() || false
};

// :: () → bool
// Returns true if this position represents a valid end of the
// expression (no required content follows after it).
ContentMatch.prototype.validEnd = function () {
    var this$1 = this;

  for (var i = this.index, count = this.count; i < this.expr.elements.length; i++, count = 0)
    { if (count < this$1.resolveValue(this$1.expr.elements[i].min)) { return false } }
  return true
};

// :: (Fragment, bool, ?number) → ?Fragment
// Try to match the given fragment, and if that fails, see if it can
// be made to match by inserting nodes in front of it. When
// successful, return a fragment of inserted nodes (which may be
// empty if nothing had to be inserted). When `toEnd` is true, only
// return a fragment if the resulting match goes to the end of the
// content expression.
ContentMatch.prototype.fillBefore = function (after, toEnd, startIndex) {
    var this$1 = this;

  var added = [], match = this, index = startIndex || 0, end = this.expr.elements.length
  for (;;) {
    var fits = match.matchFragment(after, index)
    if (fits && (!toEnd || fits.validEnd())) { return Fragment.from(added) }
    if (fits === false) { return null } // Matched to end with content remaining

    var elt = match.element
    if (match.count < this$1.resolveValue(elt.min)) {
      added.push(elt.createFiller(this$1.attrs, this$1.expr))
      match = match.move(match.index, match.count + 1)
    } else if (match.index < end) {
      match = match.move(match.index + 1, 0)
    } else if (after.childCount > index) {
      return null
    } else {
      return Fragment.from(added)
    }
  }
};

ContentMatch.prototype.possibleContent = function () {
    var this$1 = this;

  var found = []
  for (var i = this.index, count = this.count; i < this.expr.elements.length; i++, count = 0) {
    var elt = this$1.expr.elements[i], attrs = elt.constrainedAttrs(this$1.attrs, this$1.expr)
    if (count < this$1.resolveValue(elt.max)) { for (var j = 0; j < elt.nodeTypes.length; j++) {
      var type = elt.nodeTypes[j]
      if (!type.hasRequiredAttrs(attrs) && !type.isText) { found.push({type: type, attrs: attrs}) }
    } }
    if (this$1.resolveValue(elt.min) > count) { break }
  }
  return found
};

// :: (MarkType) → bool
// Check whether a node with the given mark type is allowed after
// this position.
ContentMatch.prototype.allowsMark = function (markType) {
  return this.element.allowsMark(markType)
};

// :: (NodeType, ?Object, ?[Mark]) → ?[{type: NodeType, attrs: Object}]
// Find a set of wrapping node types that would allow a node of type
// `target` with attributes `targetAttrs` to appear at this
// position. The result may be empty (when it fits directly) and
// will be null when no such wrapping exists.
ContentMatch.prototype.findWrapping = function (target, targetAttrs, targetMarks) {
  var seen = Object.create(null), first = {match: this, via: null}, active = [first]
  while (active.length) {
    var current = active.shift(), match = current.match
    if (match.matchType(target, targetAttrs, targetMarks)) {
      var result = []
      for (var obj = current; obj != first; obj = obj.via)
        { result.push({type: obj.match.expr.nodeType, attrs: obj.match.attrs}) }
      return result.reverse()
    }
    var possible = match.possibleContent()
    for (var i = 0; i < possible.length; i++) {
      var ref = possible[i];
        var type = ref.type;
        var attrs = ref.attrs;
        var fullAttrs = type.computeAttrs(attrs)
      if (!type.isLeaf && !(type.name in seen) &&
          (current == first || match.matchType(type, fullAttrs).validEnd())) {
        active.push({match: type.contentExpr.start(fullAttrs), via: current})
        seen[type.name] = true
      }
    }
  }
};

// :: (Node) → ?[{type: NodeType, attrs: Object}]
// Call [`findWrapping`](#model.ContentMatch.findWrapping) with the
// properties of the given node.
ContentMatch.prototype.findWrappingFor = function (node) {
  return this.findWrapping(node.type, node.attrs, node.marks)
};

Object.defineProperties( ContentMatch.prototype, prototypeAccessors$1 );
exports.ContentMatch = ContentMatch

var AttrValue = function(attr) { this.attr = attr };

function parseValue(nodeType, value) {
  if (value.charAt(0) == ".") {
    var attr = value.slice(1)
    if (!nodeType.attrs[attr]) { throw new SyntaxError("Node type " + nodeType.name + " has no attribute " + attr) }
    return new AttrValue(attr)
  } else {
    return JSON.parse(value)
  }
}

function resolveValue(value, attrs, expr) {
  if (!(value instanceof AttrValue)) { return value }
  var attrVal = attrs && attrs[value.attr]
  return attrVal !== undefined ? attrVal : expr.nodeType.defaultAttrs[value.attr]
}

function checkCount(elt, count, attrs, expr) {
  return count >= resolveValue(elt.min, attrs, expr) &&
    count <= resolveValue(elt.max, attrs, expr)
}

function expandTypes(schema, types) {
  var result = []
  types.forEach(function (type) {
    var found = schema.nodes[type]
    if (found) {
      if (result.indexOf(found) == -1) { result.push(found) }
    } else {
      for (var name in schema.nodes) {
        var nodeType = schema.nodes[name]
        if (nodeType.groups.indexOf(type) > -1 && result.indexOf(nodeType) == -1)
          { found = result.push(nodeType) }
      }
    }
    if (!found)
      { throw new SyntaxError("Node type or group '" + type + "' does not exist") }
  })
  return result
}

var many = 2e9 // Big number representable as a 32-bit int

function parseRepeat(nodeType, match) {
  var min = 1, max = 1
  if (match) {
    if (match[1] == "+") {
      max = many
    } else if (match[1] == "*") {
      min = 0
      max = many
    } else if (match[1] == "?") {
      min = 0
    } else if (match[2]) {
      min = parseValue(nodeType, match[2])
      if (match[3])
        { max = match[4] ? parseValue(nodeType, match[4]) : many }
      else
        { max = min }
    }
    if (max == 0 || min > max)
      { throw new SyntaxError("Invalid repeat count in '" + match[0] + "'") }
  }
  return {min: min, max: max}
}

function parseAttrs(nodeType, expr) {
  var parts = expr.split(/\s*,\s*/)
  var attrs = Object.create(null)
  for (var i = 0; i < parts.length; i++) {
    var match = /^(\w+)=(\w+|\"(?:\\.|[^\\])*\"|\.\w+)$/.exec(parts[i])
    if (!match) { throw new SyntaxError("Invalid attribute syntax: " + parts[i]) }
    attrs[match[1]] = parseValue(nodeType, match[2])
  }
  return attrs
}
