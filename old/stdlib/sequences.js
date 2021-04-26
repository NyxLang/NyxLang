const NyxDecimal = require("../types/Decimal");
const Range = require("../types/Range");

function range(start, end, step = 1) {
  if (arguments[1] === undefined && arguments[2] === undefined) {
    end = start;
    start = new NyxDecimal(0);
  }
  start = start || new NyxDecimal(0);
  step = new NyxDecimal(step.toString());

  return new Range(start, end, step);
}

function length(sequence) {
  return new NyxDecimal(sequence.__length__);
}

module.exports = { range, length };
