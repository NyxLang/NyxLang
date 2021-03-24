const NyxDecimal = require("../types/Decimal");
const Range = require("../types/Range");

function range(start, end, step = 1) {
  try {
    if (arguments.length == 1) {
      end = start;
      start = new NyxDecimal(0);
    }

    if (step == 1) {
      step = new NyxDecimal(1);
    }

    return new Range(start, end, step);
  } catch (e) {
    throw new Error("Argument(s) to range must be integers");
  }
}

function length(sequence) {
  return new NyxDecimal(sequence.__length__);
}

module.exports = { range, length };
