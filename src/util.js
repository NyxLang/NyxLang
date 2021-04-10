function mixin(source, destination) {
  for (let key of Object.getOwnPropertyNames(source)) {
    if (!destination[key]) {
      destination[key] = source[key];
    }
  }
  return destination;
}

function outputString(...args) {
  let temp = [];
  for (let item of args) {
    if (item || item === 0 || item === "" || item === false) {
      if (typeof item == "function") {
        temp.push(`<Function: ${item.name || item.__object_id__}>`);
      } else {
        temp.push(item.toString());
      }
    } else if (item == null) {
      return "nil";
    }
  }
  return temp.join("");
}

module.exports = { mixin, outputString };
