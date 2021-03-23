const v = require("voca");
const NyxPrimitive = require("./Primitive");

class NyxString extends NyxPrimitive {
  constructor(value) {
    super(value, "String", "string");
    this.__data__ = v.graphemes(value);
    this.length = this.__data__.length;
  }
}

module.exports = NyxString;
