const math = require("./_math");
const Nyx = require("./_nyx");

class NyxNumber {
  "+"(other) {
    return numberReturn(math.add(this, other));
  }
}

function numberReturn(value) {
  if (value instanceof math.Double || typeof value == "number") {
    return new Double(value);
  } else if (math.typeOf(value) == "BigNumber") {
    return new Decimal(value);
  } else if (math.typeOf(value) == "Fraction") {
    return new Fraction(value);
  } else if (math.typeOf(value) == "Complex") {
    return new Complex(value);
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

class Double extends math.Double {
  toString() {
    if (isNaN(this)) {
      return "NaN";
    } else if (this == Infinity || this == -Infinity) {
      return `${this < 0 ? "-" : ""}Infinity`;
    }
    return math.Double.prototype.toString.call(this) + "#d";
  }
}
Double = numberMixin(Double);

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
    let str = this.re ? this.re.toString() : "";
    str += this.re && this.im > 0 ? "+" : "";
    str += `${this.im.toString()}i`;
    return str;
  }

  valueOf() {
    return this.toString();
  }
}
Complex = numberMixin(Complex);

module.exports = {
  NyxNumber,
  Double,
  Decimal,
  Fraction,
  Complex,
};
