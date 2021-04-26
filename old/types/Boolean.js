const NyxPrimitive = require("./Primitive");

class NyxBoolean extends NyxPrimitive {
  constructor(value) {
    super(value, "Boolean", "Boolean");
  }
}

NyxBoolean.True = new NyxBoolean(true);
NyxBoolean.False = new NyxBoolean(false);

Object.freeze(NyxBoolean);
Object.freeze(NyxBoolean.True);
Object.freeze(NyxBoolean.false);

module.exports = NyxBoolean;
