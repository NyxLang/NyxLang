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
  Object.defineProperty(obj, "__object_id__", {
    enumerable: false,
    writable: false,
  });
  Object.defineProperty(obj, "__class__", {
    enumerable: false,
    writable: false,
  });
  Object.defineProperty(obj, "__type__", {
    enumerable: false,
    writable: false,
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

let objMixin = {};

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

Double.__superclasses__ = Arr(Num);
Double.__subclasses__ = Arr();
Object.defineProperty(Double, "__superclasses__", {
  enumerable: false,
  writable: false,
});
Object.defineProperty(Double, "__subclasses__", {
  enumerable: false,
});

function Decimal(num) {
  let o = Obj(Decimal, "Decimal");
  let d = decimal(num);
  mixinObj(o, d);
  return d;
}

Decimal.__superclasses__ = Arr(Num);
Decimal.__subclasses__ = Arr();
Object.defineProperty(Decimal, "__superclasses__", {
  enumerable: false,
  writable: false,
});
Object.defineProperty(Decimal, "__subclasses__", {
  enumerable: false,
});

function Fraction(num) {
  let o = Obj(Fraction, "Fraction");
  let f = fraction(num);
  mixinObj(o, f);
  return f;
}

Fraction.__superclasses__ = Arr(Num);
Fraction.__subclasses__ = Arr();
Object.defineProperty(Fraction, "__superclasses__", {
  enumerable: false,
  writable: false,
});
Object.defineProperty(Fraction, "__subclasses__", {
  enumerable: false,
});

function Complex(num) {
  let o = Obj(Complex, "Complex");
  let c = complex(num);
  mixinObj(o, c);
  return c;
}

Complex.__superclasses__ = Arr(Num);
Complex.__subclasses__ = Arr();
Object.defineProperty(Complex, "__superclasses__", {
  enumerable: false,
  writable: false,
});
Object.defineProperty(Complex, "__subclasses__", {
  enumerable: false,
});

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
