const uuid = require("uuid");
const hash = require("object-hash");

class NyxObject {
  constructor(className = "Object", type = "object") {
    this.__class__ = className;
    this.__type__ = type;
    this.__object_id__ = uuid.v4();
  }

  "=="(other) {
    return hash(this.__dump__);
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
