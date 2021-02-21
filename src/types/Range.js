const { Range } = require("immutable");
const NyxObject = require("./Object");

class NyxRange extends NyxObject {
  constructor(start, stop, step = 1) {
    super("Range", "range");
    this.__data__ = Range(start, stop, step);
  }

  toString() {
    return this.__data__.toString();
  }

  "to-string"() {
    return this.toString();
  }
}

module.exports = NyxRange;
