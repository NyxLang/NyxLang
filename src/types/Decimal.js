const { create, all } = require("mathjs");
const { NyxTypeError } = require("../errors");
const NyxNumber = require("./Number");

const math = create(all);
math.config({
  number: "BigNumber",
  precision: 64,
});

class NyxDecimal extends NyxNumber {
  constructor(value) {
    super(new math.bignumber(value), "Decimal", "decimal");
  }

  "-@"() {
    const res = super["-@"](this);
    return new NyxDecimal(res);
  }

  "+"(other) {
    const res = super["+"](other);
    return new NyxDecimal(res);
  }

  "-"(other) {
    const res = super["-"](other);
    return new NyxDecimal(res);
  }

  "*"(other) {
    const res = super["*"](other);
    return new NyxDecimal(res);
  }

  "/"(other) {
    if (other.__value__.toString() === "0") {
      throw new NyxTypeError("Cannot divide by zero");
    }

    const res = super["/"](other);
    return new NyxDecimal(res);
  }

  "//"(other) {
    if (other.__value__.toString() === "0") {
      throw new NyxTypeError("Cannot divide by zero");
    }

    const res = super["//"](other);
    return new NyxDecimal(res);
  }

  "%"(other) {
    const res = super["%"](other);
    return new NyxDecimal(res);
  }

  "**"(other) {
    const res = super["**"](other);
    return new NyxDecimal(res);
  }

  "integer?"() {
    return math.isInteger(this.__value__);
  }

  "NaN?"() {
    return math.isNaN(this.__value__);
  }

  "negative?"() {
    return math.isNegative(this.__value__);
  }

  "positive?"() {
    return math.isPositive(this.__value__);
  }

  "prime?"() {
    return math.isPrime(this.__value__);
  }

  "zero?"() {
    return math.isZero(this.__value__);
  }

  abs() {
    const res = super.abs();
    return new NyxDecimal(res);
  }
}

module.exports = NyxDecimal;
