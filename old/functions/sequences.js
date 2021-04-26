const Decimal = require("../objects/builtins")["Decimal"];
const Range = require("../objects/builtins")["Range"];

function range(start, stop, step = 1) {
  if (arguments[1] === undefined && arguments[2] === undefined) {
    stop = start;
    start = Decimal(0);
  }
  start = start || Decimal(0);
  step = Decimal(step.toString());

  return Range(start, stop, step);
}

module.exports = { range };
