const Decimal = require("./Numbers")["Decimal"];

class Range {
  constructor(start, stop, step) {
    this.start = Number(start.toString());
    this.stop = Number(stop.toString());
    this.step = Number(step.toString());
  }

  [Symbol.iterator]() {
    let current = this.start;
    let stop = this.stop;
    let step = this.step;
    let direction = this.start < this.stop ? "ASC" : "DESC";

    if (direction == "DESC" && step > 0) {
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
        return { value: new Decimal(val.toString()), done: false };
      },
    };
  }

  toString() {
    return `[ Range from: ${this.start}, to: ${this.stop}, by: ${this.step} ]`;
  }
}

module.exports = Range;
