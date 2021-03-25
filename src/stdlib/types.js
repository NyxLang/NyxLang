const NyxObject = require("../types/Object");
const Primitive = require("../types/Primitive");
const NyxNumber = require("../types/Number");
const Range = require("../types/Range");
const { NyxString, List } = require("../types/Sequences");
const NyxDecimal = require("../types/Decimal");

types = {
  Nil: null,
  Object: NyxObject,
  Primitive,
  Number: NyxNumber,
  Decimal: NyxDecimal,
  Range,
  List,
  String: NyxString,
};

types.String.__parent__ = types.Primitive;
types.List.__parent__ = types.Object;
types.Range.__parent__ = types.Object;
types.Decimal.__parent__ = types.Number;
types.Number.__parent__ = types.Primitive;
types.Primitive.__parent__ = types.Object;
types.Object.__parent__ = types.Nil;

module.exports = types;
