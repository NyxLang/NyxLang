const { default: Decimal } = require("decimal.js");
const NyxPrimitive = require("./Primitive");

class NyxNumber extends NyxPrimitive {
  constructor(value) {
    super(new Decimal(value));
  }
}

module.exports = NyxNumber;