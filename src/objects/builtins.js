const Nyx = require("./_nyx");
const { Inexact, Decimal, Fraction, Complex } = require("./Numbers");
const Range = require("./Range");

// Calling [value].toString() guarantees an in-language literal will still evaluate properly
function inexact(num) {
  return new Inexact(num.toString());
}

function decimal(num) {
  return new Decimal(num.toString());
}

function fraction(num) {
  return new Fraction(num.toString());
}

function complex(num) {
  return new Complex(num.toString());
}

// [value].toString() for args is handled by constructor
function range(start, stop, step) {
  return new Range(start, stop, step);
}

Nyx.Types = {
  Inexact: inexact,
  Decimal: decimal,
  Fraction: fraction,
  Complex: complex,
  Range: range,
};

module.exports = Nyx;
