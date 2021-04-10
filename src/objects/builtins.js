const object = require("./Object")["Object"];
const string = require("./String")["String"];
const double = require("./Numbers")["Double"];
const fraction = require("./Numbers")["Fraction"];
const complex = require("./Numbers")["Complex"];
const decimal = require("./Numbers")["Decimal"];
const symbol = require("./Symbol")["Symbol"];
const array = require("./Array")["Array"];
const dict = require("./Dict")["Dict"];
const range = require("./Range")["Range"];

function Obj(constructor, type) {
  let obj = object(constructor, type);
  return obj;
}

Obj.freeze = function __freeze__(obj) {
  return Object.freeze(obj);
};

Obj.is = function __is__(obj1, obj2) {
  return obj1.__object_id__ == obj2.__object_id__;
};

function Num() {
  // void - Number is abstract class
  // to return a value would cause an error
}

Num.__superclasses__ = Arr(Obj);
Num.__subclasses__ = Arr(Double, Decimal, Fraction, Complex);
Object.defineProperty(Num, "__superclasses__", {
  enumerable: false,
  writable: false,
});
Object.defineProperty(Num, "__subclasses__", {
  enumerable: false,
});

function Double(num) {
  return double(num);
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
  return decimal(num);
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
  return fraction(num);
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
  return complex(num);
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
  return string(str);
}

function Sym(sym) {
  return symbol(sym);
}

function Arr(...args) {
  return array(...args);
}

function Dict(args) {
  return dict(args);
}

function Range(start, stop, step) {
  return range(start, stop, step);
}
Range.__superclasses__ = Arr(Obj);
Range.__subclasses__ = Arr();
Object.defineProperty(Range, "__superclasses__", {
  enumerable: false,
  writable: false,
});
Object.defineProperty(Range, "__subclasses__", {
  enumerable: false,
});

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
  Range,
};
