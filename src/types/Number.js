const { create, all } = require("mathjs");
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
}

module.exports = NyxNumber;
