const double = require("./Numbers")["Double"];
const fraction = require("./Numbers")["Fraction"];
const complex = require("./Numbers")["Complex"];
const decimal = require("./Numbers")["Decimal"];
const range = require("./Range")["Range"];

function Double(num) {
  return double(num);
}

function Decimal(num) {
  return decimal(num);
}

function Fraction(num) {
  return fraction(num);
}

function Complex(num) {
  return complex(num);
}

function Range(start, stop, step) {
  return range(start, stop, step);
}

module.exports = {
  Double,
  Decimal,
  Fraction,
  Complex,
  Range,
};
