const Nyx = require("./_nyx");
const { Inexact, Decimal, Fraction, Complex } = require("./Numbers");
const Range = require("./Range");

Nyx.Inexact = Inexact;
Nyx.Decimal = Decimal;
Nyx.Fraction = Fraction;
Nyx.Complex = Complex;

Nyx.Range = Range;

// Calling [value].toString() guarantees an in-language literal will still evaluate properly
function inexact(num) {
  return new Nyx.Inexact(num.toString());
}

function decimal(num) {
  return new Nyx.Decimal(num.toString());
}

function fraction(num) {
  return new Nyx.Fraction(num.toString());
}

function complex(num) {
  return new Nyx.Complex(num.toString());
}

// [value].toString() for args is handled by constructor
function range(start, stop, step) {
  return new Nyx.Range(start, stop, step);
}

module.exports = {
  Inexact: inexact,
  Decimal: decimal,
  Fraction: fraction,
  Complex: complex,
  Range: range,
};
