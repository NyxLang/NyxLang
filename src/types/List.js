const hash = require("object-hash");
const NyxObject = require("./Object");
const NyxDecimal = require("./Decimal");

class List extends NyxObject {
  constructor(array) {
    super("list", "List");
    this.__data__ = new Map();

    let i = 0n;
    for (let item of array) {
      this.__data__.set(hash(i.toString()), item);
      i += 1n;
    }
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
    const values = [...this.__data__.values()];
    const data = this.__data__;
    let i = 0;
    return {
      next() {
        if (i < values.length) {
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
    const h = index.__hash__();
    const val = this.__data__.get(h);

    if (!val) {
      throw new Error(`Index "${index.toString()}" not found in object`);
    }

    return val;
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
}

module.exports = List;
