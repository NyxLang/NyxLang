const math = require("mathjs");

class NyxNumber {}

function Double(value) {
  return new Number(value);
}

function Decimal(value) {
  return new math.bignumber(value);
}

function Fraction(value) {
  return new math.fraction(value);
}

function Complex(value) {
  return new math.complex(value);
}

module.exports = {
  Double,
  Decimal,
  Fraction,
  Complex,
};
