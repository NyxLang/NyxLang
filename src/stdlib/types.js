const _Object = require("../types/Object");
const Primitive = require("../types/Primitive");
const _Number = require("../types/Number");
const Decimal = require("../types/Decimal");
const Range = require("../types/Range");
const { NyxString, List } = require("../types/Sequences");

types = {
  Nil: null,
  Object: _Object,
  Primitive,
  Number: _Number,
  Decimal,
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
