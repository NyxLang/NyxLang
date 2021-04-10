const Decimal = require("../objects/builtins")["Decimal"];
const Range = require("../objects/builtins")["Range"];

function range(start, end, step = 1) {
  if (arguments[1] === undefined && arguments[2] === undefined) {
    end = start;
    start = Decimal(0);
  }
  start = start || Decimal(0);
  step = Decimal(step.toString());

  return Range(start, end, step);
}

module.exports = { range };
