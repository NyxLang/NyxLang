const { Range } = require("immutable");

function range(start, end, step = 1) {
  if (arguments.length == 1) {
    end = start;
    start = 0;
  }
  return Range(start, end, step);
}

module.exports = { range };
