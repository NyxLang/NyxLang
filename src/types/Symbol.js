const NyxPrimitive = require("./Primitive");

class NyxSymbol extends NyxPrimitive {
  constructor(value) {
    super(Symbol.for(value), "Symbol", "Symbol");
    this.__name__ = s2.toString().split("(")[1].slice(0, -1);
  }

  toString() {
    return this.__name__;
  }
}

module.exports = NyxSymbol;
