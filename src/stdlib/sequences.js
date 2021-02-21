const NyxDecimal = require("../types/Decimal");
const NyxRange = require("../types/Range");

function range(start, end, step = 1) {
  if (arguments.length == 1) {
    end = start.__value__.toNumber();
    start = 0;
  } else if (arguments.length == 2) {
    start = start.__value__.toNumber();
    end = end.__value__.toNumber();
  } else {
    start = start.__value__.toNumber();
    end = end.__value__.toNumber();
    step = step.__value__.toNumber();
  }
  return new NyxRange(start, end, step);
}

module.exports = { range };
