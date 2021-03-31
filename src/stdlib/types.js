const NyxObject = require("../types/Object");
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
  Object: NyxObject,
  Primitive,
  Number: NyxNumber,
  Decimal: NyxDecimal,
  Range,
  List,
  String: NyxString,
  Boolean: NyxBoolean,
  Symbol: NyxSymbol,
};

types.NilClass.__parent__ = types.Primitive;
types.Symbol.__parent__ = types.Primitive;
types.Boolean.__parent__ = types.Primitive;
types.String.__parent__ = types.Primitive;
types.List.__parent__ = types.Object;
types.Range.__parent__ = types.Object;
types.Decimal.__parent__ = types.Number;
types.Number.__parent__ = types.Primitive;
types.Primitive.__parent__ = types.Object;
types.Object.__parent__ = types.Nil;

types.Object.prototype.__string__ = function __string__() {
  return new types.String(this.toString());
};

module.exports = types;
