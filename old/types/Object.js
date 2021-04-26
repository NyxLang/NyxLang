const uuid = require("uuid");
const hash = require("object-hash");

class BaseObject {
  constructor(className = "Object", type = "object") {
    this.__class__ = className;
    this.__type__ = type;
    this.__object_id__ = hash(uuid.v4());
    this.__dict__ = Object.create(null);
    this.__private_methods__ = Object.create(null);
    this.__protected_methods__ = Object.create(null);
    this.__subclasses__ = [];
    this.__baseclasses__ = [];

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

    Object.defineProperty(this, "__private_methods__", {
      writable: false,
      enumerable: false,
    });

    Object.defineProperty(this, "__protected_methods__", {
      writable: false,
      enumerable: false,
    });

    Object.defineProperty(this, "__subclasses__", {
      writable: false,
      enumerable: false,
    });

    Object.defineProperty(this, "__baseclasses__", {
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
    for (let key of Object.keys(this.__dict__)) {
      str += `\t${key}: ${this[key].toString()}\n`;
    }
    str += "}";
    return str;
  }

  toString() {
    return this.__dump__();
  }

  __string__() {
    return this.toString();
  }

  __call__() {}
}

BaseObject.freeze = function (obj) {
  return Object.freeze(obj);
};

module.exports = BaseObject;
