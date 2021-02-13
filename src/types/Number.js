const math = require("math.js");
const NyxPrimitive = require("./Primitive");

// math.config({
//   number: 'BigNumber',
//   precision: 64
// });

class NyxNumber extends NyxPrimitive {
  constructor(value, className, type) {
    super(value, className, type);
  }

  "+"(x) {
    const res = math.add(this, x);
  }
}

module.exports = NyxNumber;

console.log(math);