const NyxDecimal = require("./Decimal");
const NyxObject = require("./Object");

class Range extends NyxObject {
  constructor(start, stop, step) {
    super("Range", "range");
    this.start = BigInt(start.toString());
    this.stop = BigInt(stop.toString());
    this.step = BigInt(step.toString());
  }

  [Symbol.iterator]() {
    let current = this.start;
    let stop = this.stop;
    let step = this.step;
    let direction = this.start < this.stop ? "ASC" : "DESC";

    if (direction == "DESC" && step > 0n) {
      step = -step;
    }

    return {
      next() {
        let val = null;
        if (direction == "ASC" && current < stop) {
          val = current;
        } else if (direction == "DESC" && current > stop) {
          val = current;
        } else {
          return { done: true };
        }
        current += step;
        return { value: new NyxDecimal(val.toString()), done: false };
      },
    };
  }

  toString() {
    return `{ Range from: ${this.start}, to: ${this.stop}, by: ${this.step} }`;
  }
}

module.exports = Range;
