var ref = require("./comparedeep");
var compareDeep = ref.compareDeep;

// ::- A mark is a piece of information that can be attached to a node,
// such as it being emphasized, in code font, or a link. It has a type
// and optionally a set of attributes that provide further information
// (such as the target of the link). Marks are created through a
// `Schema`, which controls which types exist and which
// attributes they have.
var Mark = function(type, attrs) {
  // :: MarkType
  // The type of this mark.
  this.type = type
  // :: Object
  // The attributes associated with this mark.
  this.attrs = attrs
};

// :: ([Mark]) → [Mark]
// Given a set of marks, create a new set which contains this one as
// well, in the right position. If this mark is already in the set,
// the set itself is returned. If a mark of this type with different
// attributes is already in the set, a set in which it is replaced
// by this one is returned.
Mark.prototype.addToSet = function (set) {
    var this$1 = this;

  var copy, placed = false
  for (var i = 0; i < set.length; i++) {
    var other = set[i]
    if (this$1.eq(other)) { return set }
    if (this$1.type.excludes(other.type)) {
      if (!copy) { copy = set.slice(0, i) }
    } else if (other.type.excludes(this$1.type)) {
      return set
    } else {
      if (!placed && other.type.rank > this$1.type.rank) {
        if (!copy) { copy = set.slice(0, i) }
        copy.push(this$1)
        placed = true
      }
      if (copy) { copy.push(other) }
    }
  }
  if (!copy) { copy = set.slice() }
  if (!placed) { copy.push(this) }
  return copy
};

// :: ([Mark]) → [Mark]
// Remove this mark from the given set, returning a new set. If this
// mark is not in the set, the set itself is returned.
Mark.prototype.removeFromSet = function (set) {
    var this$1 = this;

  for (var i = 0; i < set.length; i++)
    { if (this$1.eq(set[i]))
      { return set.slice(0, i).concat(set.slice(i + 1)) } }
  return set
};

// :: ([Mark]) → bool
// Test whether this mark is in the given set of marks.
Mark.prototype.isInSet = function (set) {
    var this$1 = this;

  for (var i = 0; i < set.length; i++)
    { if (this$1.eq(set[i])) { return true } }
  return false
};

// :: (Mark) → bool
// Test whether this mark has the same type and attributes as
// another mark.
Mark.prototype.eq = function (other) {
  return this == other ||
    (this.type == other.type && compareDeep(this.attrs, other.attrs))
};

// :: () → Object
// Convert this mark to a JSON-serializeable representation.
Mark.prototype.toJSON = function () {
    var this$1 = this;

  var obj = {type: this.type.name}
  for (var _ in this$1.attrs) {
    obj.attrs = this$1.attrs
    break
  }
  return obj
};

// :: (Schema, Object) → Mark
Mark.fromJSON = function (schema, json) {
  var type = schema.marks[json.type]
  if (!type) { throw new RangeError(("There is no mark type " + (json.type) + " in this schema")) }
  return type.create(json.attrs)
};

// :: ([Mark], [Mark]) → bool
// Test whether two sets of marks are identical.
Mark.sameSet = function (a, b) {
  if (a == b) { return true }
  if (a.length != b.length) { return false }
  for (var i = 0; i < a.length; i++)
    { if (!a[i].eq(b[i])) { return false } }
  return true
};

// :: (?union<Mark, [Mark]>) → [Mark]
// Create a properly sorted mark set from null, a single mark, or an
// unsorted array of marks.
Mark.setFrom = function (marks) {
  if (!marks || marks.length == 0) { return Mark.none }
  if (marks instanceof Mark) { return [marks] }
  var copy = marks.slice()
  copy.sort(function (a, b) { return a.type.rank - b.type.rank; })
  return copy
};
exports.Mark = Mark

// :: [Mark] The empty set of marks.
Mark.none = []
