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
    const res = super["-@"]();
    return new NyxDecimal(res);
  }

  "+@"() {
    const res = super["+@"]();
    return new NyxDecimal(res);
  }

  "~@"() {
    const res = super["~@"]();
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

  "&"(other) {
    const res = super["&"](other);
    return new NyxDecimal(res);
  }

  "|"(other) {
    const res = super["|"](other);
    return new NyxDecimal(res);
  }

  "^"(other) {
    const res = super["^"](other);
    return new NyxDecimal(res);
  }

  "<<"(other) {
    const res = super["<<"](other);
    return new NyxDecimal(res);
  }

  ">>"(other) {
    const res = super[">>"](other);
    return new NyxDecimal(res);
  }

  ">>>"(other) {
    const res = super[">>>"](other);
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

  ceil() {
    const res = super.ceil();
    return new NyxDecimal(res);
  }

  denominator() {
    return new NyxDecimal(math.bignumber(1));
  }

  floor() {
    const res = super.floor();
    return new NyxDecimal(res);
  }

  gcd(other) {
    const res = super.gcd(other);
    return new NyxDecimal(res);
  }

  lcm(other) {
    const res = super.lcm(other);
    return new NyxDecimal(res);
  }

  log10() {
    const res = super.log10();
    return new NyxDecimal(res);
  }

  log2() {
    const res = super.log2();
    return new NyxDecimal(res);
  }

  norm() {
    const res = super.norm();
    return new NyxDecimal(res);
  }

  round() {
    const res = super.round();
    return new NyxDecimal(res);
  }

  sqrt() {
    const res = super.sqrt();
    return new NyxDecimal(res);
  }

  square() {
    const res = super.square();
    return new NyxDecimal(res);
  }
}

NyxDecimal.INFINITY = new NyxDecimal(Infinity);
NyxDecimal.NEGATIVE_INFINITY = new NyxDecimal(-Infinity);
NyxDecimal.NaN = new NyxDecimal(NaN);

module.exports = NyxDecimal;
