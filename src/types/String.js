const v = require("voca");
const { handleNegativeIndex } = require("../helpers");
const NyxPrimitive = require("./Primitive");

class NyxString extends NyxPrimitive {
  constructor(value) {
    super(value, "String", "string");
    this.__data__ = v.graphemes(value);
    Object.freeze(this.__data__);
    this.__length__ = this.__data__.length;
  }

  ["=="](other) {
    return this.__value__ == other.__value__;
  }

  ["[]"](index) {
    index = handleNegativeIndex(index, this);
    const val = this.__data__[index.toString()];
    if (val) {
      return new NyxString(val);
    }
    throw new Error(`Index not found in string ${this.__value__}`);
  }

  ["[]="]() {
    throw new Error("Assignment to string index not allowed");
  }

  "+"(other) {
    if (other.__type__ == "string") {
      const str = this.__value__ + other.__value__;
      return new NyxString(str);
    }
    throw new Error(`Cannot concatenate string with ${other.__type__}`);
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

  "camel-case"() {
    return new NyxString(v.camelCase(this.__value__));
  }

  capitalize() {
    return new NyxString(v.capitalize(this.__value__));
  }

  decapitalize() {
    return new NyxString(v.decapitalize(this.__value__));
  }

  downcase() {
    return new NyxString(v.lowerCase(this.__value__));
  }

  first(length) {
    let l = length.__value__.toString();
    let chars = this.__data__.slice(0, l);
    return new NyxString(chars.join(""));
  }

  hyphenate() {
    return new NyxString(v.kebabCase(this.__value__));
  }

  last(length) {
    let len = parseInt(length.__value__.toString());
    let start = this.__data__.length - len;
    let chars = this.__data__.slice(start);
    return new NyxString(chars.join(""));
  }

  "snake-case"() {
    return new NyxString(v.snakeCase(this.__value__));
  }

  "swap-case"() {
    return new NyxString(v.swapCase(this.__value__));
  }

  "title-case"() {
    return new NyxString(v.titleCase(this.__value__));
  }

  truncate(length, end = "...") {
    l = parseInt(length.__value__.toString());
    return new NyxString(v.prune(this.__value__, l, end.toString()));
  }

  upcase() {
    return new NyxString(v.upperCase(this.__value__));
  }
}

module.exports = NyxString;
