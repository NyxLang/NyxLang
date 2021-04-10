const math = require("./_math");
const { mixin } = require("../util");
const object = require("./Object")["Object"];
const defineProperties = require("./Object")["defineProperties"];

class NyxNumber {
  constructor() {
    throw new Error("Cannot instantiate abstract Number class directly");
  }

  "+"(other) {
    return numberReturn(math.add(this, other));
  }
}

function numberReturn(value) {
  console.log(math.typeOf(value));
  if (value instanceof math.Double || typeof value == "number") {
    return double(value);
  } else if (math.typeOf(value) == "BigNumber") {
    return decimal(value);
  } else if (math.typeOf(value) == "Fraction") {
    return fraction(value);
  } else if (math.typeOf(value) == "Complex") {
    return complex(value);
  } else {
    return value;
  }
}

function numberMixin(destination) {
  for (let key of Object.getOwnPropertyNames(NyxNumber.prototype)) {
    destination.__proto__[key] = NyxNumber.prototype[key];
  }
  return destination;
}

function double(value) {
  let d = new math.double(value);
  let o = object(double, "Double");
  mixin(o, d);
  defineProperties(d);
  d.toString = function doubleToString() {
    if (isNaN(value)) {
      return "NaN";
    } else if (value == Infinity || value == -Infinity) {
      return `${value < 0 ? "-" : ""}Infinity`;
    }
    return `${d.__proto__.toString.call(d)}d`;
  };
  return numberMixin(d);
}

function decimal(value) {
  let d = new math.bignumber(value);
  let o = object(decimal, "Decimal");
  mixin(o, d);
  defineProperties(d);
  return numberMixin(d);
}

function fraction(value) {
  let f = new math.fraction(value);
  let o = object(fraction, "Fraction");
  mixin(o, f);
  defineProperties(f);
  f.toString = function fractionToString() {
    let str = f.s > -1 ? "" : "-";
    str += `${f.n}/${f.d}`;
    return str;
  };
  return numberMixin(f);
}

function complex(value) {
  let c = new math.complex(value);
  let o = object(complex, "Complex");
  mixin(o, c);
  defineProperties(c);
  c.toString = function complexToString() {
    let str = c.re.toString();
    str += c.im < 0 ? "" : "+";
    str += `${c.im.toString()}i`;
    return str;
  };
  return numberMixin(c);
}

module.exports = {
  Number: NyxNumber,
  Double: double,
  Decimal: decimal,
  Fraction: fraction,
  Complex: complex,
};
