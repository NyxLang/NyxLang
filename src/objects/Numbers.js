const math = require("./_math");
const Nyx = require("./_nyx");

class NyxNumber {
  "+"(other) {
    return numberReturn(math.add(this, other));
  }
}

function numberReturn(value) {
  if (value instanceof math.Inexact || typeof value == "number") {
    return new Nyx.Inexact(value);
  } else if (math.typeOf(value) == "BigNumber") {
    return new Nyx.Decimal(value);
  } else if (math.typeOf(value) == "Fraction") {
    return new Nyx.Fraction(value);
  } else if (math.typeOf(value) == "Complex") {
    return new Nyx.Complex(value);
  } else {
    return value;
  }
}

function numberMixin(destination) {
  for (let key of Object.getOwnPropertyNames(NyxNumber.prototype)) {
    destination.prototype[key] = NyxNumber.prototype[key];
  }
  return destination;
}

class Inexact extends math.Inexact {
  toString() {
    if (isNaN(this)) {
      return "NaN";
    } else if (this == Infinity || this == -Infinity) {
      return `${this < 0 ? "-" : ""}Infinity`;
    }
    return math.Inexact.prototype.toString.call(this) + "i";
  }
}

Nyx.Inexact = numberMixin(Inexact);

class Decimal extends math.BigNumber {}
Decimal = numberMixin(Decimal);

class Fraction extends math.Fraction {
  toString() {
    let str = this.s > -1 ? "" : "-";
    str += `${this.n}/${this.d}`;
    return str;
  }
}
Fraction = numberMixin(Fraction);

class Complex extends math.Complex {
  toString() {
    let str = this.re.toString();
    str += this.im < 0 ? "" : "+";
    str += `${this.im.toString()}i`;
    return str;
  }
}
Complex = numberMixin(Complex);

module.exports = {
  Inexact,
  Decimal,
  Fraction,
  Complex,
};
