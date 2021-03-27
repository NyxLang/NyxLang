const v = require("voca");
const { SliceArray } = require("slice");
const Sugar = require("sugar");
const ms = require("mout/string");
const hash = require("object-hash");
const NyxPrimitive = require("./Primitive");
const NyxDecimal = require("./Decimal");
const NyxObject = require("./Object");
const { handleNegativeIndex, decimalParameterToInt } = require("../helpers");

Sugar.String.extend();

class NyxString extends NyxPrimitive {
  constructor(value) {
    super(value, "String", "string");
    this.__length__ = this.__value__.length;
  }

  ["=="](other) {
    return this.__value__ == other.__value__;
  }

  ["[]"](index) {
    index = handleNegativeIndex(index, this);
    const val = this.__value__[index.toString()];
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

  "*"(other) {
    return this.repeat(other);
  }

  [Symbol.iterator]() {
    this.current = 0;
    return this;
  }

  next() {
    if (this.current < this.length) {
      return {
        value: new NyxString(this.__value__[this.current++]),
        done: false,
      };
    }
    return { done: true };
  }

  "alpha?"() {
    return v.isAlpha(this.__value__);
  }

  "alpha-numeric?"() {
    return v.isAlphaDigit(this.__value__);
  }

  append(str) {
    return new NyxString(
      v.insert(this.__value__, str.__value__, this.__length__)
    );
  }

  "base64-decode"() {
    return new NyxString(this.__value__.decodeBase64());
  }

  "base64-encode"() {
    return new NyxString(this.__value__.encodeBase64());
  }

  "blank?"() {
    return v.isBlank(this.__value__);
  }

  "camel-case"() {
    return new NyxString(v.camelCase(this.__value__));
  }

  capitalize() {
    return new NyxString(this.__value__.capitalize(true));
  }

  "char-at"(pos) {
    return new NyxString(this.__value__[pos.toString()]);
  }

  "code-point-at"(pos) {
    return new NyxDecimal(v.codePointAt(this.__value__, pos.toString()));
  }

  "code-points"() {
    const points = v.codePoints(this.__value__);
    const nums = points.map((point) => new NyxDecimal(point));
    return new List(nums);
  }

  compact() {
    return new NyxString(this.__value__.compact());
  }

  contains(str) {
    return this.includes(str);
  }

  count(str) {
    return new NyxDecimal(v.countSubstrings(this.__value__, str.__value__));
  }

  "count-where"(pred) {
    let count = 0;
    let i = 0;
    for (let char of this.__value__) {
      if (pred(new NyxString(char, new NyxDecimal(i.toString()), this))) {
        count++;
      }
    }
    return new NyxDecimal(count.toString());
  }

  "count-words"() {
    return new NyxString(v.countWords(this.__value__));
  }

  crop(i) {
    i = parseInt(i.toString());
    return new NyxString(ms.crop(this.__value__, i));
  }

  downcase() {
    return new NyxString(v.lowerCase(this.__value__));
  }

  each(fn) {
    for (let char of this.__value__) {
      fn(new NyxString(char));
    }
  }

  "each-with-index"(fn) {
    let i = 0;
    for (let char of this.__value__) {
      fn(new NyxString(char), new NyxDecimal(i));
      i++;
    }
  }

  "empty?"() {
    return v.isEmpty(this.__value__);
  }

  "ends-with?"(str) {
    return v.endsWith(this.__value__, str.__value__);
  }

  "escape-html"() {
    return new NyxString(this.__value__.escapeHTML());
  }

  "escape-regexp"() {
    return new NyxString(ms.escapeRegExp(this.__value__));
  }

  "escape-unicode"(printable = false) {
    return new NyxString(ms.escapeUnicode(this.__value__, printable));
  }

  "escape-url"() {
    return new NyxString(this.__value__.escapeURL());
  }

  first(length) {
    let l = length.toString();
    return new NyxString(v.first(this.__value__, l));
  }

  from(i = 0) {
    return new NyxString(this.__value__.from(parseInt(i.toString())));
  }

  "grapheme-at"(pos) {
    pos = parseInt(pos.toString());
    return new NyxString(v.graphemeAt(this.__value__, pos));
  }

  graphemes() {
    const gs = v.graphemes(this.__value__);
    const chars = gs.map((g) => new NyxString(g));
    return new List(chars);
  }

  hyphenate() {
    return new NyxString(v.kebabCase(this.__value__));
  }

  "includes?"(str) {
    return v.includes(this.__value__, str.__value__);
  }

  "index-of"(str, idx = 0) {
    return new NyxDecimal(
      v.indexOf(this.__value__, str.__value__, parseInt(idx.toString()))
    );
  }

  insert(str, pos) {
    return new NyxString(
      v.insert(this.__value__, str.__value__, parseInt(pos.toString()))
    );
  }

  "integer?"() {
    return v.isDigit(this.__value__);
  }

  last(length) {
    let len = parseInt(length.__value__.toString());
    return new NyxString(v.last(this.__value__, len));
  }

  latinize() {
    return new NyxString(v.latinise(this.__value__));
  }

  "lowercase?"() {
    return v.isLowerCase(this.__value__);
  }

  "numeric?"() {
    return v.isNumeric(this.__value__);
  }

  pad(length, padding = " ") {
    return new NyxString(
      v.pad(this.__value__, parseInt(length.toString()), padding.__value__)
    );
  }

  "pad-left"(length, padding = " ") {
    return new NyxString(
      v.padLeft(this.__value__, parseInt(length.toString()), padding.__value__)
    );
  }

  "pad-right"(length, padding = " ") {
    return new NyxString(
      v.padRight(this.__value__, parseInt(length.toString()), padding.__value__)
    );
  }

  "pascal-case"() {
    return new NyxString(ms.pascalCase(this.__value__));
  }

  parameterize() {
    return new NyxString(this.__value__.parameterize());
  }

  prepend(str) {
    return new NyxString(v.insert(this.__value__, str.__value__, 0));
  }

  remove(str) {
    return new NyxString(this.__value__.remove(str.toString()));
  }

  "remove-all"(str) {
    return new NyxString(this.__value__.removeAll(str.toString()));
  }

  // Removes HTML tags *and their content*
  "remove-html"(tags = "all") {
    if (tags instanceof List) {
      tags = [...tags].map((tag) => tag.toString());
    } else if (tags instanceof NyxString) {
      tags = tags.toString();
    }
    return new NyxString(this.__value__.removeTags(tags));
  }

  "remove-non-ascii"() {
    return new NyxString(ms.removeNonASCII(this.__value__));
  }

  "remove-non-word"() {
    return new NyxString(ms.removeNonWord(this.__value__));
  }

  repeat(times = 1) {
    return new NyxString(v.repeat(this.__value__, times.toString()));
  }

  replace(search, replace) {
    return v.replace(this.__value__, search.__value__, replace.__value__);
  }

  "replace-all"(search, replace) {
    return v.replaceAll(this.__value__, search.__value__, replace.__value__);
  }

  reverse() {
    return new NyxString(v.reverseGrapheme(this.__value__));
  }

  "sentence-case"() {
    return new NyxString(ms.sentenceCase(this.__value__));
  }

  shift(n) {
    n = parseInt(n.toString());
    return new NyxString(this.__value__.shift(n));
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
    const chars = SliceArray.from(this.__value__.split(""));
    const sliced = chars[[start, stop, step]];
    if (reversed) {
      sliced.reverse();
    }
    return new NyxString(sliced.join(""));
  }

  slugify() {
    return new NyxString(v.slugify(this.__value__));
  }

  "snake-case"() {
    return new NyxString(v.snakeCase(this.__value__));
  }

  spacify() {
    return new NyxString(this.__value__.spacify());
  }

  split(sep = "") {
    const chunks = v.split(this.__value__, sep.toString());
    const strs = chunks.map((str) => new NyxString(str));
    return new List(strs);
  }

  "starts-with?"(str) {
    return v.startsWith(this.__value__, str.__value__);
  }

  "strip-bom"() {
    return new NyxString(v.stripBom(this.__value__));
  }

  "strip-tags"(tags) {
    if (tags instanceof List) {
      tags = [...tags].map((tag) => tag.toString());
    } else if (tags instanceof NyxString) {
      tags = tags.toString();
    }
    return new NyxString(this.__value__.stripTags(tags));
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

  to(i = this.__length__) {
    i = parseInt(i.toString());
    return new NyxString(this.__value__.to(i));
  }

  trim() {
    return new NyxString(v.trim(this.__value__));
  }

  "trim-left"() {
    return new NyxString(v.trimLeft(this.__value__));
  }

  "trim-right"() {
    return new NyxString(v.trimRight(this.__value__));
  }

  truncate(length, end = "...") {
    let l = parseInt(length.__value__.toString());
    return new NyxString(v.truncate(this.__value__, l, end.toString()));
  }

  "un-camel-case"(delimiter = " ") {
    delimiter = delimiter.toString();
    return new NyxString(ms.unCamelCase(this.__value__));
  }

  "unescape-html"() {
    return new NyxString(this.__value__.unescapeHTML());
  }

  "unescape-unicode"() {
    return new NyxString(ms.unescapeUnicode(this.__value__));
  }

  "unescape-url"() {
    return new NyxString(this.__value__.unescapeURL());
  }

  "un-hyphenate"() {
    return new NyxString(ms.unhyphenate(this.__value__));
  }

  upcase() {
    return new NyxString(v.upperCase(this.__value__));
  }

  "uppercase?"() {
    return v.isUpperCase(this.__value__);
  }

  words() {
    const ws = v.words(this.__value__);
    const strs = ws.map((w) => new NyxString(w));
    return new List(strs);
  }
}

class List extends NyxObject {
  constructor(array) {
    super("List", "list");
    this.__data__ = array;
    this.__length__ = this.__data__.length;
  }

  toString() {
    let str = "[";
    for (let val of this.__data__) {
      str += `${val.toString()}, `;
    }
    str = str.substring(0, str.length - 2) + "]";
    return str;
  }

  [Symbol.iterator]() {
    const data = this.__data__;
    let i = 0;
    return {
      next() {
        if (i < data.length) {
          const val = {
            value: data[i],
            done: false,
          };
          i++;
          return val;
        }
        return { done: true };
      },
    };
  }

  "[]"(index) {
    index = handleNegativeIndex(index, this);
    const i = decimalParameterToInt(index);
    const val = this.__data__[i];

    if (!val) {
      throw new Error(`Index not found in object`);
    }

    return val;
  }

  "[]="(index, value) {
    index = handleNegativeIndex(index, this);
    const i = decimalParameterToInt(index);
    this.__data__[i] = value;
    this.__length__ = this.__data__.length;
    return value;
  }

  "<<"(item) {
    return this.push(item);
  }

  append(item) {
    return this.push(item);
  }

  each(fn) {
    for (let item of this) {
      fn(item);
    }
  }

  "each-with-index"(fn) {
    let i = 0;
    for (let item of this) {
      fn(item, new NyxDecimal(i.toString()));
      i++;
    }
  }

  join(sep = "") {
    const arr = [...this];
    const str = arr.join(sep.toString());
    return new NyxString(str);
  }

  map(fn) {
    let mapped = new List([]);
    for (let item of this) {
      mapped.push(fn(item));
    }
    return mapped;
  }

  push(item) {
    this["[]="](new NyxDecimal(this.__length__.toString()), item);
    this.__length__ = this.__data__.length;
    return this;
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
    const arr = SliceArray.from([...this]);
    const sliced = arr[[start, stop, step]];
    if (reversed) {
      sliced.reverse();
    }
    return new List([...sliced]);
  }
}

module.exports = { NyxString, List };
