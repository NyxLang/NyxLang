const math = require("mathjs");
const { NyxTypeError } = require("../errors");
const NyxNumber = require("./Number");

class NyxDecimal extends NyxNumber {
  constructor(value) {
    super(new math.bignumber(value), "Decimal", "decimal");
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
}

module.exports = NyxDecimal;
