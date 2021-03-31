const NyxPrimitive = require("./Primitive");

class NilClass extends NyxPrimitive {
  constructor() {
    super(null, "NilClass", "Nil");
  }

  toString() {
    return "nil";
  }
}
