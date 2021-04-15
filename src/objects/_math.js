const { create, all, factory, typedDependencies } = require("mathjs");
const Double = require("./_double");

let math = create(typedDependencies);
math.config({
  number: "BigNumber",
  precision: 64,
});

const allOthers = Object.keys(all)
  .map((key) => all[key])
  .filter((factory) => math[factory.fn] === undefined);

math.import([
  factory(
    "Inexact",
    ["typed"],
    function createDouble({ typed }) {
      typed.addType({
        name: "Inexact",
        test: function isInexact(x) {
          return x instanceof Double;
        },
      });
      return Double;
    },
    { lazy: false }
  ),
  factory("inexact", ["typed", "Inexact"], function createInexact({ typed }) {
    return typed("inexact", {
      "number | string": (x) => new math.Inexact(x),
      BigNumber: (x) => new math.Inexact(x.toNumber()),
      Fraction: (x) => new math.Inexact(x.valueOf()),
    });
  }),
  factory("add", ["typed"], function createInexactAdd({ typed }) {
    return typed("add", {
      "Inexact, Inexact": (a, b) => math.inexact(a + b),
      "Inexact, BigNumber | Fraction": (a, b) =>
        math.inexact(math.add(a.valueOf(), b)),
      "BigNumber | Fraction, Inexact": (a, b) =>
        math.inexact(math.add(a, b.valueOf())),
    });
  }),
]);

math.typed.conversions.unshift(
  {
    from: "Inexact",
    to: "number",
    convert: function doubleToNumber(double) {
      return Number(double);
    },
  },
  {
    from: "Inexact",
    to: "BigNumber",
    convert: function doubleToBigNum(double) {
      return new math.BigNumber(double.valueOf());
    },
  },
  {
    from: "Inexact",
    to: "Fraction",
    convert: function doubleToFraction(double) {
      return new math.Fraction(double.valueOf());
    },
  },
  {
    from: "Inexact",
    to: "Complex",
    convert: function doubleToComplex(double) {
      return new math.Complex(double.valueOf());
    },
  },
  {
    from: "BigNumber",
    to: "Inexact",
    convert: function bigNumToDouble(bignum) {
      return new math.Double(bignum);
    },
  },
  {
    from: "Fraction",
    to: "Inexact",
    convert: function fractionToDouble(fraction) {
      return new math.Double(fraction);
    },
  },
  {
    from: "Fraction",
    to: "BigNumber",
    convert: function fractionToBigNum(fraction) {
      return new math.BigNumber(fraction.n).div(fraction.d);
    },
  }
);

math.import(allOthers);

module.exports = math;
