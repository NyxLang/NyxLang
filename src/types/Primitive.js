const NyxObject = require("./Object");

class NyxPrimitive extends NyxObject {
  constructor(value) {
    super();
    this.__value__ = value;
  }

  toString() {
    return this.__value__.toString();
  }

  valueOf() {
    return this.__value__.valueOf();
  }
}

module.exports = NyxPrimitive;