const object = require("./Object")["Object"];
const string = require("./String")["String"];
const number = require("./Numbers")["Number"];
const double = require("./Numbers")["Double"];
const fraction = require("./Numbers")["Fraction"];
const complex = require("./Numbers")["Complex"];
const decimal = require("./Numbers")["Decimal"];
const symbol = require("./Symbol")["Symbol"];
const array = require("./Array")["Array"];
const dict = require("./Dict")["Dict"];

function mixin(source, destination) {
  for (let key of Object.getOwnPropertyNames(source)) {
    if (!destination[key]) {
      destination[key] = source[key];
    }
  }
  return destination;
}

function defineProps(obj) {
  Object.defineProperty(obj, "__dict__", {
    enumerable: false,
  });
  Object.defineProperty(obj, "__subclasses__", {
    enumerable: false,
  });
  Object.defineProperty(obj, "__superclasses__", {
    enumerable: false,
  });
}

function mixinObj(source, destination) {
  mixin(source, destination);
  mixin(source.__proto__, destination.__proto__);
  defineProps(destination);
  return destination;
}

let objProtoMixin = {
  __string__: function __string__() {
    return Str(this.toString());
  },
};

let objMixin = {
  __dict__: Object.create(null), // use Dict when exists
  __subclasses__: [], // use Arr when exists
  __superclasses__: [], // use Arr when exists
};

function Obj(constructor, type) {
  let obj = object(constructor, type);
  mixin(objProtoMixin, obj.__proto__);
  mixin(objMixin, obj);
  defineProps(obj);
  return obj;
}

Obj.freeze = function __freeze__(obj) {
  return Object.freeze(obj);
};

Obj.is = function __is__(obj1, obj2) {
  return obj1.__object_id__ == obj2.__object_id__;
};

function Num(value) {
  return value;
}

function Double(num) {
  let o = Obj(Double, "Double");
  let d = double(num);
  mixinObj(o, d);
  return d;
}

function Decimal(num) {
  let o = Obj(Decimal, "Decimal");
  let d = decimal(num);
  mixinObj(o, d);
  return d;
}

function Fraction(num) {
  let o = Obj(Fraction, "Fraction");
  let f = fraction(num);
  mixinObj(o, f);
  return f;
}

function Complex(num) {
  let o = Obj(Complex, "Complex");
  let c = complex(num);
  mixinObj(o, c);
  return c;
}

function Str(str) {
  let o = Obj(Str, "String");
  let s = string(str);
  mixinObj(o, s);
  s.__length__ = Decimal(s.length);
  Object.defineProperty(s, "__length__", {
    enumerable: false,
    writable: false,
  });
  return s;
}

function Sym(sym) {
  return symbol(sym);
}

function Arr(...args) {
  let o = Obj(Arr, "Array");
  let a = array(...args);
  mixinObj(o, a);
  a.__length__ = Decimal(a.length);
  Object.defineProperty(a, "__length__", {
    enumerable: false,
    writable: false,
  });
  return a;
}

function Dict(args) {
  return dict(args);
}

module.exports = {
  Object: Obj,
  Number: Num,
  Double,
  Decimal,
  Fraction,
  Complex,
  String: Str,
  Symbol: Sym,
  Array: Arr,
  Dict,
};
