const object = require("./Object")["Object"];
const string = require("./String")["String"];
const double = require("./Numbers")["Double"];
const fraction = require("./Numbers")["Fraction"];
const complex = require("./Numbers")["Complex"];
const decimal = require("./Numbers")["Decimal"];
const symbol = require("./Symbol")["Symbol"];
const array = require("./Array")["Array"];
const dict = require("./Dict")["Dict"];

function Obj(obj) {
  return obj;
}

function Double(num) {
  return num;
}

function Decimal(num) {
  return num;
}

function Fraction(num) {
  return num;
}

function Complex(num) {
  return num;
}

function Str(str) {
  return str;
}

function Sym(sym) {
  return sym;
}

function Arr(arr) {
  return arr;
}

function Dict(d) {
  return d;
}

module.exports = {
  Object: Obj,
  Double,
  Decimal,
  Fraction,
  Complex,
  String: Str,
  Symbol: Sym,
  Array: Arr,
  Dict,
};
