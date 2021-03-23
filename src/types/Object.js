const hash = require("object-hash");
const equal = require("fast-deep-equal/es6");

class NyxObject {
  constructor(className = "Object", type = "object") {
    this.__class__ = className;
    this.__type__ = type;
  }

  "=="(other) {
    return equal(this, other);
  }

  is(other) {
    return Object.is(this, other);
  }

  "!="(other) {
    return !equal(this, other);
  }

  "to-string"() {
    this.toString();
  }

  toString() {
    let str = `<class:${this.__class__}>\n`;
    str += "{\n";
    for (let key of Object.keys(this)) {
      str += `\t${key}: ${this[key]}\n`;
    }
    str += "}";
    return str;
  }

  __dump__() {
    return this.toString();
  }

  __hash__() {
    return hash(this.toString());
  }
}

module.exports = NyxObject;
