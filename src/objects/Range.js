const decimal = require("./Numbers")["Decimal"];
const object = require("./Object")["Object"];
const defineProperties = require("./Object")["defineProperties"];
const { mixin } = require("../util");

class Range {
  constructor(start, stop, step) {
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
        return { value: decimal(val.toString()), done: false };
      },
    };
  }

  toString() {
    return `[ Range from: ${this.start}, to: ${this.stop}, by: ${this.step} ]`;
  }
}

function range(start, stop, step) {
  let r = new Range(start, stop, step);
  let o = object(range, "Range");
  mixin(o, r);
  defineProperties(r);
  return r;
}

module.exports = { Range: range };
