const uuid = require("uuid");
const equal = require("fast-deep-equal");

class NyxObject {
  constructor(className = "Object", type = "object") {
    this.__class__ = className;
    this.__type__ = type;
    this.__object_id__ = uuid.v4();

    Object.defineProperty(this, "__object_id__", {
      writable: false,
      enumerable: false,
    });

    Object.defineProperty(this, "__type__", {
      writable: false,
      enumerable: false,
    });

    Object.defineProperty(this, "__class__", {
      writable: false,
      enumerable: false,
    });
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

  __dump__() {
    let str = `<class:${this.__class__}>\n`;
    str += "{\n";
    for (let key of Object.keys(this)) {
      str += `\t${key}: ${this[key].toString()}\n`;
    }
    str += "}";
    return str;
  }

  toString() {
    return this.__dump__();
  }
}

module.exports = NyxObject;
