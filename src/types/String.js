const v = require("voca");
const { SliceArray } = require("slice");
const { handleNegativeIndex } = require("../helpers");
const NyxPrimitive = require("./Primitive");
const NyxDecimal = require("./Decimal");

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

  // not working
  // capitalize() {
  //   return new NyxString(v.capitalize(this.__value__));
  // }

  "char-at"(pos) {
    return new NyxString(this.__data__[pos.toString()]);
  }

  "code-point-at"(pos) {
    return new NyxDecimal(v.codePointAt(this.__value__, pos.toString()));
  }

  // not working
  // decapitalize() {
  //   return new NyxString(v.decapitalize(this.__value__));
  // }

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

  slice(start, stop, step = 1) {
    if (arguments.length == 1) {
      stop = parseInt(start.toString());
      start = 0;
    } else {
      start = parseInt(start.toString());
      stop = parseInt(stop.toString());
      step = parseInt(step.toString());
    }
    let reversed = false;
    if (step < 0) {
      step = -step;
      reversed = true;
    }
    const chars = SliceArray.from(this.__data__);
    const sliced = chars[[start, stop, step]];
    if (reversed) {
      sliced.reverse();
    }
    return new NyxString(sliced.join(""));
  }

  "snake-case"() {
    return new NyxString(v.snakeCase(this.__value__));
  }

  substring(start, end) {
    return this.slice(start, end);
  }

  "swap-case"() {
    return new NyxString(v.swapCase(this.__value__));
  }

  "title-case"() {
    return new NyxString(v.titleCase(this.__value__));
  }

  // not great
  truncate(length, end = "...") {
    let l = parseInt(length.__value__.toString());
    return new NyxString(v.truncate(this.__value__, l, end.toString()));
  }

  upcase() {
    return new NyxString(v.upperCase(this.__value__));
  }
}

module.exports = NyxString;
