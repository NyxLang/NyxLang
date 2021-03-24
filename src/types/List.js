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
}

module.exports = List;
