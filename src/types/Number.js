const { create, all } = require("mathjs");
const NyxPrimitive = require("./Primitive");

const math = create(all);
math.config({
  number: 'BigNumber',
  precision: 64
});

class NyxNumber extends NyxPrimitive {
  constructor(value, className, type) {
    super(value, className, type);
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
}

module.exports = NyxNumber;
