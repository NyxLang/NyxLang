const hash = require("object-hash");

class NyxSymbol {
  constructor(name) {
    this.__object_id__ = hash(name);
    this.__class__ = S.Symbol;
    this.__type__ = "Symbol";
    this.name = name.toString();
  }
}

function Sym() {
  return new NyxSymbol();
}

const S = { Symbol: Sym };

module.exports = S;
