const BaseObject = require("../types/Object");
const Primitive = require("../types/Primitive");
const NyxNumber = require("../types/Number");
const Range = require("../types/Range");
const { NyxString, List } = require("../types/Sequences");
const NyxDecimal = require("../types/Decimal");
const NyxBoolean = require("../types/Boolean");
const NilClass = require("../types/NilClass");
const NyxSymbol = require("../types/Symbol");

types = {
  NilClass: NilClass,
  BaseObject,
  Primitive,
  Number: NyxNumber,
  Decimal: NyxDecimal,
  Range,
  List,
  String: NyxString,
  Boolean: NyxBoolean,
  Symbol: NyxSymbol,
};

types.BaseObject.prototype.__string__ = function __string__() {
  return new types.String(this.toString());
};

module.exports = types;
