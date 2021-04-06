const object = require("./Object")["Object"];
const string = require("./String")["String"];
const double = require("./Numbers")["Double"];
const fraction = require("./Numbers")["Fraction"];
const complex = require("./Numbers")["Complex"];
const decimal = require("./Numbers")["Decimal"];
const symbol = require("./Symbol")["Symbol"];
const array = require("./Array")["Array"];
const dict = require("./Dict")["Dict"];

function mixin(source, destination) {
  for (let key of Object.getOwnPropertyNames(source)) {
    destination[key] = source[key];
  }
  return destination;
}

let objProtoMixin = {
  __string__: function __string__() {
    return Str(this.toString());
  },
};

let objMixin = {
  __dict__: Dict([]),
  __subclasses__: Arr(),
  __superclasses__: Arr(),
};

function Obj(constructor, type) {
  let obj = object(constructor, type);
  mixin(objProtoMixin, obj.__proto__);
  mixin(objMixin, obj);

  Object.defineProperty(obj, "__dict__", {
    enumerable: false,
  });
  Object.defineProperty(obj, "__subclasses__", {
    enumerable: false,
  });
  Object.defineProperty(obj, "__superclasses__", {
    enumerable: false,
  });

  return obj;
}

Obj.freeze = function __freeze__(obj) {
  return Object.freeze(obj);
};

Obj.is = function __is__(obj1, obj2) {
  return obj1.__object_id__ == obj2.__object_id__;
};

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

function Dict(args) {
  return dict(args);
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
