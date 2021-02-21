const NyxRange = require("../types/Range");

function range(start, end, step = 1) {
  if (arguments.length == 1) {
    end = start;
    start = 0;
  }
  return new NyxRange(start, end, step);
}

module.exports = { range };
