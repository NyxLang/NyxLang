const { Decimal } = require("decimal.js");
const { NyxTypeError } = require("../errors");
const NyxPrimitive = require("./Primitive");

class NyxDecimal extends NyxPrimitive {
  constructor(value) {
    super(new Decimal(value), "Decimal", "decimal");
  }

  "+"(other) {
    if (other.__type__ == "decimal") {
      let res = this.__value__.plus(other.__value__);
      return new NyxDecimal(res.toString());
    }
    throw new NyxTypeError(`Cannot add decimal and ${other.__type__}`);
  }

  "-"(other) {
    if (other.__type__ == "decimal") {
      let res = this.__value__.minus(other.__value__);
      return new NyxDecimal(res.toString());
    }
    throw new NyxTypeError(`Cannot subtract ${other.__type__} from decimal`);
  }

  "*"(other) {
    if (other.__type__ == "decimal") {
      let res = this.__value__.times(other.__value__);
      return new NyxDecimal(res.toString());
    }
    throw new NyxTypeError(`Cannot multiply decimal and ${other.__type__}`);
  }

  "/"(other) {
    if (other.__value__.toString() === "0") {
      throw new NyxTypeError("Cannot divide by zero");
    }

    if (other.__type__ == "decimal") {
      let res = this.__value__.dividedBy(other.__value__);
      return new NyxDecimal(res.toString());
    }
    throw new NyxTypeError(`Cannot divide decimal and ${other.__type__}`);
  }

  "%"(other) {
    if (other.__type__ == "decimal") {
      let res = this.__value__.modulo(other.__value__);
      return new NyxDecimal(res.toString());
    }
    throw new NyxTypeError(`Cannot perform modulo operation on decimal and ${other.__type__}`);
  }
}

module.exports = NyxDecimal;