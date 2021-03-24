const NyxDecimal = require("../types/Decimal");
const NyxString = require("../types/String");

function type(obj) {
  return obj.__type__;
}

function className(obj) {
  return obj.__class__;
}

function id(obj) {
  return obj.__object_id__;
}

function dump(obj) {
  return obj.__dump__();
}

function hash(obj) {
  return new NyxString(obj.__hash__());
}

function string(obj) {
  return new NyxString(obj.toString());
}

function decimal(obj) {
  return new NyxDecimal(obj.toString());
}

module.exports = {
  type,
  "class-name": className,
  id,
  dump,
  hash,
  string,
  decimal,
};
