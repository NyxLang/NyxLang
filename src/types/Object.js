const hash = require("object-hash");

class NyxObject {
  constructor(className="Object", type="object") {
    setProperties(hash.sha1(this), className, type);
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

function setProperties(objectId, className, type, parent) {
  Object.defineProperty(NyxObject.prototype,
    "__object_id__", {
      writable: false,
      enumerable: false,
      value: objectId
    }
  );

    Object.defineProperty(NyxObject.prototype,
    "__class__", {
      writable: false,
      enumerable: false,
      value: className
    }
  );

  Object.defineProperty(NyxObject.prototype,
    "__type__", {
      writable: false,
      enumerable: false,
      value: type
    }
  );
}


module.exports = NyxObject;