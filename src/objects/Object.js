const uuid = require("uuid");
const hash = require("object-hash");

class BaseObject {
  constructor(constructor = Obj.Object, type = "object") {
    this.__class__ = constructor;
    this.__type__ = type;
    this.__object_id__ = hash(uuid.v4());
    // do this.__dict__ as builtin Hash/Dict/Map

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
}

function defineProperties(obj) {
  Object.defineProperty(obj, "__object_id__", {
    writable: false,
    enumerable: false,
  });

  Object.defineProperty(obj, "__type__", {
    writable: false,
    enumerable: false,
  });

  Object.defineProperty(obj, "__class__", {
    writable: false,
    enumerable: false,
  });
  return obj;
}

function NewObject(constructor, type) {
  let o = new BaseObject(constructor, type);
  return o;
}

const Obj = { Object: NewObject, defineProperties };

module.exports = Obj;
