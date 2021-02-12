const { default: Decimal } = require("decimal.js");
const NyxPrimitive = require("./Primitive");

class NyxDecimal extends NyxPrimitive {
  constructor(value) {
    super(new Decimal(value), "Decimal", "decimal");
  }
}

module.exports = NyxDecimal;