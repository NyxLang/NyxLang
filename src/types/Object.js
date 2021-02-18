const uuid = require("uuid");

class NyxObject {
  constructor(className="Object", type="object") {
    this.__object_id__ = uuid.v4();
    this.__class__ = className;
    this.__type__ = type;
  }

  toString() {
    this.toString();
  }

  __dump__() {
    let str = `<class:${this.__class__}, id:${this.__object_id__}>\n`;
    str += "{\n";
    for (let key of Object.keys(this)) {
      str += `\t${key}: ${this[key]}\n`;
    }
    str += "}";
    return str;
  }
}

module.exports = NyxObject;