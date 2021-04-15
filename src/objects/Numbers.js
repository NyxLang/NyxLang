const math = require("./_math");
const { mixin } = require("../util");

class NyxNumber {
  constructor() {
    throw new Error("Cannot instantiate abstract Number class directly");
  }

  "+"(other) {
    return numberReturn(math.add(this, other));
  }
}

function numberReturn(value) {
  if (value instanceof math.Inexact || typeof value == "number") {
    return inexact(value);
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

function inexact(value) {
  let d = new math.inexact(value.valueOf());
  d.toString = function inexactToString() {
    if (isNaN(value)) {
      return "NaN";
    } else if (value == Infinity || value == -Infinity) {
      return `${value < 0 ? "-" : ""}Infinity`;
    }
    return `${d.__proto__.toString.call(d)}i`;
  };
  Object.defineProperty(d, "toString", {
    writable: false,
    enumerable: false,
  });
  return numberMixin(d);
}

console.log(inexact(5)["+"](inexact(6)));

function decimal(value) {
  let d = new math.bignumber(value);
  return numberMixin(d);
}

function fraction(value) {
  let f = new math.fraction(value);
  f.toString = function fractionToString() {
    let str = f.s > -1 ? "" : "-";
    str += `${f.n}/${f.d}`;
    return str;
  };
  Object.defineProperty(f, "toString", {
    writable: false,
    enumerable: false,
  });
  return numberMixin(f);
}

function complex(value) {
  let c = new math.complex(value);
  c.toString = function complexToString() {
    let str = c.re.toString();
    str += c.im < 0 ? "" : "+";
    str += `${c.im.toString()}i`;
    return str;
  };
  Object.defineProperty(c, "toString", {
    writable: false,
    enumerable: false,
  });
  return numberMixin(c);
}

module.exports = {
  Number: NyxNumber,
  Inexact: inexact,
  Decimal: decimal,
  Fraction: fraction,
  Complex: complex,
};
