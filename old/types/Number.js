const { create, all, bitXor } = require("mathjs");
const NyxPrimitive = require("./Primitive");

const math = create(all);
math.config({
  number: "BigNumber",
  precision: 64,
});

class NyxNumber extends NyxPrimitive {
  constructor(value, className, type) {
    super(value, className, type);
  }

  "-@"() {
    return math.unaryMinus(this.__value__);
  }

  "+@"() {
    return math.unaryPlus(this.__value__);
  }

  "~@"() {
    return math.bitNot(this.__value__);
  }

  "+"(x) {
    return math.add(this.__value__, x.__value__);
  }

  "-"(x) {
    return math.subtract(this.__value__, x.__value__);
  }

  "*"(x) {
    return math.multiply(this.__value__, x.__value__);
  }

  "/"(x) {
    return math.divide(this.__value__, x.__value__);
  }

  "//"(x) {
    return math.floor(math.divide(this.__value__, x.__value__));
  }

  "%"(x) {
    return math.mod(this.__value__, x.__value__);
  }

  "**"(x) {
    return math.pow(this.__value__, x.__value__);
  }

  "=="(x) {
    return math.equal(this.__value__, x.__value__);
  }

  "!="(x) {
    return math.unequal(this.__value__, x.__value__);
  }

  ">"(x) {
    return math.larger(this.__value__, x.__value__);
  }

  "<"(x) {
    return math.smaller(this.__value__, x.__value__);
  }

  ">="(x) {
    return math.largerEq(this.__value__, x.__value__);
  }

  "<="(x) {
    return math.smallerEq(this.__value__, x.__value__);
  }

  "&"(x) {
    return math.bitAnd(this.__value__, x.__value__);
  }

  "|"(x) {
    return math.bitOr(this.__value__, x.__value__);
  }

  "^"(x) {
    return math.bitXor(this.__value__, x.__value__);
  }

  "<<"(x) {
    return math.leftShift(this.__value__, x.__value__);
  }

  ">>"(x) {
    return math.rightArithShift(this.__value__, x.__value__);
  }

  ">>>"(x) {
    return math.rightLogShift(this.__value__, x.__value__);
  }

  abs() {
    return math.abs(this.__value__);
  }

  ceil() {
    return math.ceil(this.__value__);
  }

  floor() {
    return math.floor(this.__value__);
  }

  gcd(x) {
    return math.gcd(this.__value__, x.__value__);
  }

  lcm(x) {
    return math.lcm(this.__value__, x.__value__);
  }

  log10() {
    return math.log10(this.__value__);
  }

  log2() {
    return math.log2(this.__value__);
  }

  norm() {
    return math.norm(this.__value__);
  }

  round() {
    return math.round(this.__value__);
  }

  sqrt() {
    return math.sqrt(this.__value__);
  }

  square() {
    return math.square(this.__value__);
  }
}

module.exports = NyxNumber;
