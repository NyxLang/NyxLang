const _Object = require("../types/Object");
const Primitive = require("../types/Primitive");
const _Number = require("../types/Number");
const Decimal = require("../types/Decimal");
const Range = require("../types/Range");

types = {
  Nil: null,
  Object: _Object,
  Primitive,
  Number: _Number,
  Decimal,
  Range,
};

types.Range.__parent__ = types.Object;
types.Decimal.__parent__ = types.Number;
types.Number.__parent__ = types.Primitive;
types.Primitive.__parent__ = types.Object;
types.Object.__parent__ = types.Nil;

module.exports = types;
