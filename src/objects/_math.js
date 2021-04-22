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
    "Double",
    ["typed"],
    function createDouble({ typed }) {
      typed.addType({
        name: "Double",
        test: function isDouble(x) {
          return x instanceof Double;
        },
      });
      return Double;
    },
    { lazy: false }
  ),
  factory("double", ["typed", "Double"], function createDouble({ typed }) {
    return typed("double", {
      "number | string": (x) => new math.Double(x),
      BigNumber: (x) => new math.Double(x.toNumber()),
      Fraction: (x) => new math.Double(x.valueOf()),
    });
  }),
  factory("add", ["typed"], function createDoubleAdd({ typed }) {
    return typed("add", {
      "Double, Double": (a, b) => math.double(a + b),
      "Double, BigNumber | Fraction": (a, b) =>
        math.double(math.add(a.valueOf(), b)),
      "BigNumber | Fraction, Double": (a, b) =>
        math.double(math.add(a, b.valueOf())),
    });
  }),
]);

math.typed.conversions.unshift(
  {
    from: "Double",
    to: "number",
    convert: function doubleToNumber(double) {
      return Number(double);
    },
  },
  {
    from: "Double",
    to: "BigNumber",
    convert: function doubleToBigNum(double) {
      return new math.BigNumber(double.valueOf());
    },
  },
  {
    from: "Double",
    to: "Fraction",
    convert: function doubleToFraction(double) {
      return new math.Fraction(double.valueOf());
    },
  },
  {
    from: "Double",
    to: "Complex",
    convert: function doubleToComplex(double) {
      return new math.Complex(double.valueOf());
    },
  },
  {
    from: "BigNumber",
    to: "Double",
    convert: function bigNumToDouble(bignum) {
      return new math.Double(bignum);
    },
  },
  {
    from: "Fraction",
    to: "Double",
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
