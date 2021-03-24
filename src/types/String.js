const v = require("voca");
const NyxPrimitive = require("./Primitive");

class NyxString extends NyxPrimitive {
  constructor(value) {
    super(value, "String", "string");
    this.__data__ = v.graphemes(value);
    this.__length__ = this.__data__.length;
  }

  ["=="](other) {
    return this.__value__ == other.__value__;
  }

  ["[]"](index) {
    const val = this.__data__[index.toString()];
    if (val) {
      return val;
    }
    throw new Error(
      `Index ${index.toString()} not found in string ${this.__value__}`
    );
  }

  ["[]="]() {
    throw new Error("Assignment to string index not allowed");
  }

  [Symbol.iterator]() {
    this.current = 0;
    return this;
  }

  next() {
    if (this.current < this.length) {
      return {
        value: new NyxString(this.__data__[this.current++]),
        done: false,
      };
    }
    return { done: true };
  }
}

module.exports = NyxString;
