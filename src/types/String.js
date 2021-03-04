const NyxObject = require("./Object");

class NyxString extends NyxObject {
  constructor(value) {
    super(value, "String", "string");
  }
}
