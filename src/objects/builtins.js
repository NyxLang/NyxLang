const Nyx = require("./_nyx");
const { Double, Decimal, Fraction, Complex } = require("./Numbers");
const Range = require("./Range");

// Calling [value].valueOf() guarantees an in-language literal will still evaluate properly
function double(num) {
  return new Double(num.valueOf());
}

function decimal(num) {
  return new Decimal(num.valueOf());
}

function fraction(num) {
  return new Fraction(num.valueOf());
}

function complex(num) {
  return new Complex(num.valueOf());
}

// [value].toString() for args is handled by constructor
function range(start, stop, step) {
  return new Range(start, stop, step);
}

Nyx.Types = {
  Double: double,
  Decimal: decimal,
  Fraction: fraction,
  Complex: complex,
  Range: range,
};

module.exports = Nyx;
