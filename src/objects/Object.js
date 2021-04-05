const uuid = require("uuid");
const hash = require("object-hash");

class BaseObject {
  constructor(constructor = Obj.Object, type = "object") {
    this.__class__ = constructor;
    this.__type__ = type;
    this.__object_id__ = hash(uuid.v4());
    this.__dict__ = Object.create(null);

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

    Object.defineProperty(this, "__dict__", {
      writable: false,
      enumerable: false,
    });
  }

  is(other) {
    return this.__object_id__ == other.__object_id__;
  }

  __dump__() {
    let str = `<class:${this.__class__}, id: ${this.__object_id__}>`;
    str += "{\n";
    for (let key of Object.keys(this)) {
      str += `\t${key}: ${this[key].toString()}\n`;
    }
    for (let key of Object.keys(this.__dict__)) {
      str += `\t${key}: ${this[key].toString()}\n`;
    }
    str += "}";
    return str;
  }

  __string__() {
    return new String(this.toString());
  }
}

function NewObject(destination, constructor, type) {
  let o = new BaseObject(constructor, type);
  for (let key of Object.getOwnPropertyNames(o)) {
    destination[key] = o[key];
  }
  for (let key of Object.getOwnPropertyNames(o.__proto__)) {
    destination.__proto__[key] = o.__proto__[key];
  }
  return destination;
}

NewObject.freeze = function freeze(obj) {
  return Object.freeze(obj);
};

const Obj = { Object: NewObject };

module.exports = Obj;
