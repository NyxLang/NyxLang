const hash = require("object-hash");
const { SliceArray } = require("slice");
const NyxObject = require("./Object");
const NyxDecimal = require("./Decimal");
const { handleNegativeIndex } = require("../helpers");

class List extends NyxObject {
  constructor(array) {
    super("list", "List");
    this.__data__ = new Map();

    let i = 0n;
    for (let item of array) {
      this.__data__.set(hash(i.toString()), item);
      i += 1n;
    }
    this.__length__ = this.__data__.size;
  }

  toString() {
    let str = "[";
    for (let val of this.__data__.values()) {
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
        if (i < data.size) {
          const val = {
            value: data.get(hash(i.toString())),
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
    const h = index.__hash__();
    const val = this.__data__.get(h);

    if (!val) {
      throw new Error(`Index not found in object`);
    }

    return val;
  }

  "[]="(index, value) {
    index = handleNegativeIndex(index, this);
    const h = index.__hash__();
    this.__data__.set(h, value);
    this.__length__ = this.__data__.size;
    return value;
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

module.exports = List;
